import { IAction, IPlainAction, IPlainFailAction } from 'shared/types/redux';
import { IAuthData, IChatMessage, IRoom } from './chatApi/namespace';

export type MessageType = 'message' | 'user_joined' | 'user_left' | 'unknown';

export interface IMessagesState {
  [roomId: string]: IChatMessage[];
}

export interface IReduxState {
  data: {
    status: ChatStatus;
    userId: string | null;
    error: string | null;
    rooms: IRoom[];
    roomId: string | null;
    firstIndexOfToday: number | null;
    messages: IMessagesState;
    currentMessageId: string | null;
    isCacheValid: boolean;
  };
  edit: {
    messageFilter: string;
  };
}

export type DateFormating = 'full' | 'short';

export type ChatStatus = 'offline' | 'connecting' | 'online';

export interface IMessageForm {
  text: string;
}

export interface ISearchForm {
  text: string;
}

export interface IHistory {
  roomId: string;
  messages: IChatMessage[];
}

export type IInitChat = IPlainAction<'CHAT:INIT'>;
export type IInitChatSuccess = IPlainAction<'CHAT:INIT_SUCCESS'>;
export type IInitChatFail = IPlainFailAction<'CHAT:INIT_FAIL'>;

export type ILogin = IPlainAction<'CHAT:LOGIN'>;
export type ILoginSuccess = IAction<'CHAT:LOGIN_SUCCESS', IAuthData>;
export type ILoginFail = IPlainFailAction<'CHAT:LOGIN_FAIL'>;

export type IChatConnected = IPlainAction<'CHAT:CONNECTED'>;
export type IChatDisconnected = IPlainAction<'CHAT:DISCONNECTED'>;

export type IMessageReceived = IAction<'CHAT:MESSAGE_RECEIVED', IChatMessage>;
export type IHistoryReceived = IAction<'CHAT:HISTORY_RECEIVED', IHistory>;
export type IMessageDeleted = IAction<'CHAT:MESSAGE_DELETED', {messageId: string, roomId: string}>;

export type ISendMessage = IPlainAction<'CHAT:SEND_MESSAGE'>;
export type ISendMessageSuccess = IPlainAction<'CHAT:SEND_MESSAGE_SUCCESS'>;
export type ISendMessageFail = IPlainFailAction<'CHAT:SEND_MESSAGE_FAIL'>;

export type IChatError = IAction<'CHAT:ERROR', string>;

export type IJoinRoom = IAction<'CHAT:JOIN_ROOM', string>;

export type IFetchRooms = IPlainAction<'CHAT:FETCH_ROOMS'>;
export type IFetchRoomsSuccess = IAction<'CHAT:FETCH_ROOMS_SUCCESS', IRoom[]>;
export type IFetchRoomsFail = IPlainFailAction<'CHAT:FETCH_ROOMS_FAIL'>;

export type ISubmitSearchForm = IAction<'CHAT:SUBMIT_SEARCH_FORM', ISearchForm>;

export type ISwitchRoom = IAction<'CHAT:SWITCH_ROOM', string>;
export type ISwitchRoomSuccess = IAction<'CHAT:SET_CURRENT_ROOM_ID', string>;

export type IEditMessage = IAction<'CHAT:EDIT_MESSAGE', IChatMessage>;

export type ICopyToMessage = IAction<'CHAT:COPY_TO_MESSAGE', string>;

export type ISetCacheValidity = IAction<'CHAT:SET_CACHE_VALIDITY', boolean>;

export type Action =
  | IChatError
  | IInitChat
  | IInitChatSuccess
  | IInitChatFail
  | IChatConnected
  | IChatDisconnected
  | ILogin
  | ILoginSuccess
  | ILoginFail
  | IFetchRooms
  | IFetchRoomsSuccess
  | IFetchRoomsFail
  | IJoinRoom
  | IEditMessage
  | ICopyToMessage
  | ISetCacheValidity
  | ISendMessage
  | ISendMessageSuccess
  | ISendMessageFail
  | ISubmitSearchForm
  | ISwitchRoom
  | ISwitchRoomSuccess
  | IMessageReceived
  | IHistoryReceived
  | IMessageDeleted;
