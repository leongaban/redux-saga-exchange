import { IPlainAction, IAction, IPlainFailAction } from 'shared/types/redux';

export interface IMessageBase<M extends MessageType, T> {
  type: M;
  data: T;
}

export interface ILoadCurrency {
  currencyName: string;
  interval: string;
}

export type MessageType =
  | 'chat'
  | 'exchange'
  | 'user';

export type LoadCurrency = IMessageBase<'exchange', ILoadCurrency>;

export type Message = LoadCurrency;

export type IActionResult = any;
export type LoadCurrencyAction = (actionType: string, data: any) => IActionResult;
export type UserAction = (data: any) => IActionResult;
export type ChatAction = (actionType: string, data: any) => IActionResult;

export type Action = LoadCurrencyAction;

export interface IHandlers {
  exchange: LoadCurrencyAction;
  chat: ChatAction;
  user: UserAction;
}
export interface IConnectSocketsPayload {
  userId: number;
  token: string;
}

export type IConnect = IAction<'SOCKETS:CONNECT', IConnectSocketsPayload>;
export type IDisconnect = IPlainAction<'SOCKETS:DISCONNECT'>;
export type IConnectCompleted = IPlainAction<'SOCKETS:CONNECT_COMPLETED'>;
export type IConnectFail = IPlainFailAction<'SOCKETS:CONNECT_FAIL'>;

export type IShouldSubscribeAction = IPlainAction<'SOCKETS:SHOULD_SUBSCRIBE'>;

export type ISocketAction = IConnect | IDisconnect | IConnectCompleted | IConnectFail;

export interface IChannelAndType {
  channel: string;
  type: string;
}

export type ISocketResponse = any;

export type IOpenChanel = IAction<'SOCKETS:OPEN_CHANNEL', string>;
export type IOpenChanelCompleted = IPlainAction<'SOCKETS:OPEN_CHANNEL_COMPLETED'>;
export type IOpenChanelFailed = IPlainFailAction<'SOCKETS:OPEN_CHANNEL_FAILED'>;

export type ICloseChanel = IAction<'SOCKETS:CLOSE_CHANEL', string>;
export type ICloseChanelCompleted = IPlainAction<'SOCKETS:CLOSE_CHANEL_COMPLETED'>;
export type ICloseChanelFailed = IPlainFailAction<'SOCKETS:CLOSE_CHANEL_FAILED'>;
