export interface IAuthData {
  id: string;
  token: string;
  tokenExpires: number;
}

export interface IRocketChatOptions {
  restApiUrl: string;
  wssApiUrl: string;
  loginUrl: string;
}

export type TRocketChatEvent =
  | 'chatError'
  | 'connected'
  | 'disconnected'
  | 'tokenAcquired'
  | 'login'
  | 'loginSuccess'
  | 'loginFail'
  | 'roomListFetched'
  | 'messageReceived'
  | 'messageDeleted'
  | 'subscribedToRoom'
  | 'unsubscribedFromRoom'
  | 'joinedRoom'
  | 'leftRoom'
  | 'fetchedHistory';

export type MessageType = 'message' | 'user_joined' | 'user_left' | 'error' | 'unknown';

export interface IChatMessage {
  id: string;
  type: MessageType;
  roomId: string;
  body: string;
  author: { name: string; id: string };
  date: number;
  edited?: { date: number; username: string; id: string };
}

export type RoomType = 'direct' | 'chat' | 'private_chat' | 'unknown';

export interface IRoom {
  id: string;
  type: RoomType;
  name?: string;
  creator?: string;
  topic?: string;
  isMuted?: boolean;
  isReadOnly?: boolean;
}

export interface IDDPResponse<T> {
  id: string;
  result: T;
  error?: string;
}

export interface IDDPChangeMessage {
  collection: string;
  fields: {
    eventName: string;
    args: [{[_id: string]: string }];
  };
}

// Raw structs from RC API

export interface IRawAuthData {
  id: string;
  token: string;
  tokenExpires: { $date: number };
}

export type TRawRoomType = 'd' | 'c' | 'p' | 'l';

export interface IRawRoom {
  _id: string;
  t: TRawRoomType; // room type
  name: string;
  u: { _id: string; username: string } | null; // author
  topic?: string;
  muted?: boolean;
  ro?: boolean; // read-only; private chats only
}

export interface IRawResponse {
  _id: string;
  error?: string;
}

export type TRawChatMessageType = 'uj' | 'ul' | undefined;

export interface IRawChatMessage extends IRawResponse {
  ts: { $date: number };
  t?: TRawChatMessageType;
  rid: string;
  u: {
    _id: string;
    name: string;
    username: string;
  };
  msg: string;
  editedBy?: { _id: string; username: string };
  editedAt?: { $date: number };
}
