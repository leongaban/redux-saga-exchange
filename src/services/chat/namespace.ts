import {IAction, IPlainAction, IPlainFailAction} from 'shared/types/redux';

export type IOpenChannel = IAction<'CHAT:OPEN_CHANNEL', string>;
export type IOpenChannelSuccess = IPlainAction<'CHAT:OPEN_CHANNEL_SUCCESS'>;
export type IOpenChannelFail = IPlainFailAction<'CHAT:OPEN_CHANNEL_FAIL'>;

export type ICloseChannel = IAction<'CHAT:CLOSE_CHANNEL', string>;
export type ICloseChannelSuccess = IPlainAction<'CHAT:CLOSE_CHANNEL_SUCCESS'>;
export type ICloseChannelFail = IPlainFailAction<'CHAT:CLOSE_CHANNEL_FAIL'>;

export type Action =
  | IOpenChannel | IOpenChannelSuccess | IOpenChannelFail
  | ICloseChannel | ICloseChannelSuccess | ICloseChannelFail;
