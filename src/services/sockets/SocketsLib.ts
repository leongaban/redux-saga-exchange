import { bind } from 'decko';
import * as NS from './namespace';
// import NodeSocket from './NodeSocket';
import SignalSocket from './SignalSocket';
import { signalWebsocketServerPrivate, signalWebsocketServerPublic } from '../../config';

class SocketsLib {
  // private nodeInstance: NodeSocket;
  private privateSignalInstance: SignalSocket;
  private publicSignalInstance: SignalSocket;
  private eventMap: { [key: string]: any };
  private commandMap: { [key: string]: any };

  public constructor() {
    this.initialize();
  }

  public initialize() {
    // this.nodeInstance = new NodeSocket(nodeWebsocketServer);
    this.privateSignalInstance = new SignalSocket(signalWebsocketServerPrivate);
    this.publicSignalInstance = new SignalSocket(signalWebsocketServerPublic);
    // this.nodeInstance.on('error', this.socketErrorHandler.bind(this, 'Node Socket'));
    this.privateSignalInstance.on('error', this.socketErrorHandler.bind(this, 'Private Socket'));
    this.publicSignalInstance.on('error', this.socketErrorHandler.bind(this, 'Public Socket'));
    this.setEventMap();
  }

  @bind
  public connect() {
    this.privateSignalInstance.connect();
    // this.nodeInstance.reconnect();
    this.publicSignalInstance.connect();
  }

  @bind
  public disconnect() {
    // this.nodeInstance.close();
    this.publicSignalInstance.disconnect();
    this.privateSignalInstance.disconnect();
  }

  @bind
  public onDisconnect() {
    this.disconnect();
  }

  @bind
  public enterChannel(type: string, onEnter?: any) {
    this.getSocketInstance(type).enterChannel(type, onEnter);
  }

  @bind
  public leaveChannel(type: string) {
    this.getSocketInstance(type).leaveChannel(type);
  }

  @bind
  public subscribe<T extends NS.MessageType>(channel: string, handler: NS.IHandlers[T]) {
    this.getSocketInstance(channel).subscribe(channel, handler);
  }

  @bind
  public unsubscribe(channel: string, eventHandler: any) {
    this.getSocketInstance(channel).unsubscribe(channel, eventHandler);
  }

  @bind
  public command(command: string, params: any, callback?: any) {
    const socketInstance = this.commandMap[command];
    socketInstance.command(command, params, callback);
  }

  private setEventMap() {
    this.eventMap = {
      // Изменение балансов
      Balance: this.privateSignalInstance,
      // Текущие МОИ открытые ордера (покупка или продажа)
      OpenOrders: this.privateSignalInstance,
      Transfers: this.privateSignalInstance,
      // Текущие (и новые) сделки по ордерам (когда покупка и продажа нашли друг друга)
      Trades: this.publicSignalInstance,
      // Для виджета Order Book - показывает текущие предложения
      Book: this.publicSignalInstance,
      MiniTicker: this.publicSignalInstance,
      // Основной канал чарта
      Chart: this.publicSignalInstance,
    };

    this.commandMap = {
      ChartHistory: this.publicSignalInstance,
    };
  }

  private getSocketInstance(type: string) {
    const parts = type.split('.');
    return (this.eventMap[parts[0]]);
  }

  private socketErrorHandler(socketId: string, err: Error | string) {
    if (typeof err === 'string') {
      console.info('Socket [' + socketId + '] error: ', err);
    } else if (err && err.message) {
      console.info('Socket [' + socketId + '] error: ', err.message);
      if (err.stack) {
        console.error(err);
      }
    } else {
      console.info('Socket [' + socketId + '] error:', err);
    }
  }
}

export default SocketsLib;
