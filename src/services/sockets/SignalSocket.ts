import { ConsoleLogger, HubConnection, LogLevel, TransportType } from '@aspnet/signalr';
import * as EventEmitter from 'events';
import { bind, debounce } from 'decko';

interface IChannel {
  stream: any;
  listeners: number;
}

class SignalSocket {

  public static defaultLogLevel: any = process.env.NODE_ENV === 'production' ? LogLevel.Error : LogLevel.Error;
  private hub: HubConnection;
  private wsEvents: EventEmitter = new EventEmitter();
  private events: EventEmitter = new EventEmitter();
  private channels: { [key: string]: IChannel } = {};
  private connected: boolean = false;
  private wasDisconnectRequested: boolean = false;
  private attempts: number = 0;

  constructor(url: string) {
    this.hub = new HubConnection(url, {
      transport: TransportType.WebSockets,
      logger: new ConsoleLogger(SignalSocket.defaultLogLevel),
    });
    this.hub.onclose(this.handleHubClose);
    this.wsEvents.on('error', this.handleError);
  }

  public connect() {
    this.hub.start().then(
      () => {
        this.attempts = 0;
        this.connected = true;
        this.wsEvents.emit('connect');
      },
    ).catch(
      err => {
        this.connected = false;
        this.wsEvents.emit('error', err);
        this.reconnect();
      },
    );
  }

  public disconnect() {
    const areAllChannelsClosed = Object.keys(this.channels).length === 0;
    if (this.connected) {
      if (areAllChannelsClosed) {
        this.hub.stop().catch(
          err => this.wsEvents.emit('error', err),
        );
      } else {
        this.wasDisconnectRequested = true;
      }
    }
  }

  public subscribe(eventName: string, eventHandler: any) {
    this.wsEvents.on(eventName, eventHandler);
  }

  public unsubscribe(eventName: string, eventHandler: any) {
    this.wsEvents.removeListener(eventName, eventHandler);
  }

  public enterChannel(channelId: string, onEnter?: any) {
    if (!this.connected) {
      this.wsEvents.once('connect', () => this.enterChannel(channelId, onEnter));
      return channelId;
    }

    if (this.channels[channelId] && onEnter) {
      onEnter();
    }
    const channel = this.channels[channelId] || this.createChannel(channelId, onEnter);
    channel.listeners++;
    return channelId;
  }

  public leaveChannel(channelId: string) {
    const channel = this.channels[channelId];
    if (channel != null) {
      channel.listeners--;
      if (channel.listeners <= 0) {
        this.removeChannel(channel, channelId);
      }
    }
    const areAllChannelsClosed = Object.keys(this.channels).length === 0;
    if (this.wasDisconnectRequested && areAllChannelsClosed) {
      this.wasDisconnectRequested = false;
      this.disconnect();
    }
  }

  public command(name: string, params?: any, callback?: any) {
    if (!this.connected) {
      this.wsEvents.once('connect', () => this.command(name, params, callback));
      return;
    }

    const parameters = params || [];
    this.hub.invoke(name, ...parameters)
      .then(data => callback(data))
      .catch(err => this.events.emit('error', err));
  }

  public on(eventName: string, callback: any) {
    return this.events.on(eventName, callback);
  }

  public off(eventName: string, callback: any) {
    this.events.removeListener(eventName, callback);
  }

  // TODO make params not in string and add typings!
  private createChannel(channelId: string, onEnter?: any) {
    const parts: string[] = channelId.split('.');
    const channelName: string = parts[0];
    const params: string[] = parts.slice(1);
    const par = channelName === 'Transfers' ? [{ count: 100 }] : params;
    const channel = this.hub.stream(channelName, ...par).subscribe({
      next: (item: any) => {
        this.wsEvents.emit(channelId, item);
      },
      error: (e: any) => this.wsEvents.emit('error', e),
    });
    onEnter && onEnter();
    this.channels[channelId] = {
      stream: channel,
      listeners: 0,
    };
    return this.channels[channelId];
  }

  private removeChannel(channel: IChannel, channelId: string) {
    channel.stream.dispose();
    delete (this.channels[channelId]);
  }

  @bind
  private handleError(err: Error) {
    this.events.emit('error', err);
  }

  @bind
  private handleHubClose(err?: Error) {
    this.connected = false;
    if (err && err.message && (err.message.includes('1006') || err.message.includes('timeout'))) {
      this.reconnect();
      this.wsEvents.once('connect', () => {
        Object.keys(this.channels).forEach(channelId => {
          const channel = this.createChannel(channelId);
          channel.listeners++;
        });
      });
    }
  }

  @bind
  @debounce(1000)
  private reconnect() {
    if (this.attempts < 50) {
      this.connect();
      this.attempts++;
    }
  }
}

export default SignalSocket;
