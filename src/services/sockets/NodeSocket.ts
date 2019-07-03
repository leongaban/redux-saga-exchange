import {bind} from 'decko';
import * as EventsEmitter from 'events';

interface IChannel {
  accepted: boolean;
  listeners: number;
  events: EventsEmitter;
}

class NodeSocket {

  private socket: WebSocket;
  private needReconnect: boolean = true;
  private url: string;
  private channels: {[key: string]: IChannel} = {};
  private events: EventsEmitter = new EventsEmitter();
  private wsEvents: EventsEmitter = new EventsEmitter();
  private payloadIndex: number = 0;
  private callbacks: {[key: number]: any} = {};
  private connected: boolean = false;
  private isError: boolean = false;

  constructor(url: string) {
    this.url = url;
    this.wsEvents.on('cmd', this.oncmd);
    this.wsEvents.on('error', (cmdIndex: number, e: any) => {
      console.error(e);
    });
    this.wsEvents.on('open', this.onchannelopen);
  }

  public close() {
    this.needReconnect = false;
    this.socket.close();
  }

  public command(name: string, params?: any[], callback?: any) {
    const cmdId = (this.payloadIndex++);
    if (callback) {
      this.callbacks[cmdId] = callback;
    }
    this.emit('cmd', { index: cmdId, name, params });
    // this.emit(name, params);
  }

  public enterChannel(name: string, onEnter?: any) {
    const channel: IChannel = this.channels[name] || this.createChannel(name);
    if (onEnter) {
      if (channel.accepted) {
        onEnter();
      } else {
        channel.events.on('accept', () => {
          onEnter && onEnter();
          channel.events.removeListener('accept', onEnter);
        });
      }
    }
    channel.listeners++;
    return name;
  }

  public leaveChannel(name: string) {
    const channel: IChannel = this.channels[name];
    if (channel) {
      channel.listeners--;
      if (channel.listeners <= 0) {
        this.removeChannel(name);
      }
    }
  }

  public subscribe(eventName: string, eventHandler: any) {
    this.wsEvents.on(eventName, eventHandler);
  }

  public unsubscribe(eventName: string, eventHandler: any) {
    this.wsEvents.removeListener(eventName, eventHandler);
  }

  public on(eventName: string, callback: any) {
    return this.events.on(eventName, callback);
  }

  public off(eventName: string, callback: any) {
    this.events.removeListener(eventName, callback);
  }

  public reconnect(attempt?: number) {
    this.socket = new WebSocket(this.url);
    this.socket.onopen = this.onopen;
    this.socket.onclose = this.onclose;
    this.socket.onmessage = this.onmessage;
    this.socket.onerror = this.onerror;
    this.events.emit('reconnect', attempt);
  }

  private emit(event: string, ...args: any[]) {
    if (this.connected) {
      this.socket.send(JSON.stringify([event, args]));
    }
  }

  @bind
  private onopen(ev: Event) {
    this.connected = true;
    this.events.emit('open');
    for (const name in this.channels) {
      if (this.channels.hasOwnProperty(name)) {
        this.emit('subscribe.channel', {name});
      }
    }
  }

  @bind
  private onclose(ev: CloseEvent) {
    this.connected = false;
    if (this.isError) {
      this.isError = false;
      this.events.emit('error', {message: ev.reason || 'Connection failed'});
    }
    this.events.emit('close');
    if (this.needReconnect) {
      setTimeout(() => this.reconnect(), 3000);
    }
  }

  @bind
  private onmessage(event: MessageEvent) {
    try {
      const pack = JSON.parse(event.data);
      this.wsEvents.emit.apply(this.wsEvents, [pack[0]].concat(pack[1]));
    } catch (error) {
      this.wsEvents.emit('error', null, error);
    }
  }

  @bind
  private oncmd(cmdId: number, response: any) {
    const callback = this.callbacks[cmdId];
    if (callback != null) {
      callback.apply(this, response);
      delete(this.callbacks[cmdId]);
    }
  }

  @bind
  private onerror(ev: Event) {
    this.isError = true;
  }

  @bind
  private onchannelopen(channelId: string, state: boolean) {
    if (this.channels[channelId] != null) {
      const channel = this.channels[channelId];
      channel.accepted = true;
      channel.events.emit('accept');
    }
  }

  private createChannel(name: string): IChannel {
    const channel: IChannel = {
      accepted: false,
      listeners: 0,
      events: new EventsEmitter(),
    };
    if (!this.connected) {
      this.wsEvents.on('open', () => this.createChannel(name));
      return channel;
    }
    this.channels[name] = channel;
    this.emit('subscribe.channel', {name});
    return channel;
  }

  private removeChannel(name: string) {
    this.emit('unsubscribe.channel', {name});
    delete(this.channels[name]);
  }
}

export default NodeSocket;
