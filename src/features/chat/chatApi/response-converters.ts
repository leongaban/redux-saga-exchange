import { pathOr } from 'ramda';
import uuid from 'uuid';

import {
  IAuthData,
  RoomType,
  IRoom,
  IRawChatMessage,
  IChatMessage,
  MessageType,
  IRawRoom,
  IRawAuthData,
  IRawResponse,
} from './namespace';

import { getOrThrow } from './utils';

const ROOM_TYPE_MAP = {
  d: 'direct',
  c: 'chat',
  p: 'private_chat',
};

const MESSAGE_TYPE_MAP = {
  uj: 'user_joined',
  ul: 'user_left',
};

const mapRoomType = (RCRoomTypeId: string): RoomType => pathOr('unknown', [RCRoomTypeId], ROOM_TYPE_MAP);

const mapMessageType = (RCMessageTypeId: string | undefined): MessageType =>
  RCMessageTypeId ? pathOr('unknown', [RCMessageTypeId], MESSAGE_TYPE_MAP) : 'message';

export const convertAuthMessage = (rawAuthData: IRawAuthData): IAuthData => {
  const g = getOrThrow(rawAuthData);
  return {
    id: g('id'),
    token: g('token'),
    tokenExpires: g(['tokenExpires', '$date']),
  };
};

export const convertRoomData = ({ _id, t, name, u, topic, muted, ro }: IRawRoom): IRoom => ({
  id: _id,
  type: mapRoomType(t),
  name,
  creator: u ? u.username : undefined,
  topic,
  isReadOnly: ro,
  isMuted: muted,
});

export interface IRawChannel {
  _id: string;
  name: string;
  t: RoomType;
}

export interface IRawChannelList {
  channels: IRawChannel[];
}

const convertChannelData = (channelData: IRawChannel): IRoom => ({
  id: channelData._id,
  type: mapRoomType(channelData.t),
  name: channelData.name,
});

export const convertChannelList = (messagePayload: IRawChannelList): IRoom[] =>
  messagePayload.channels.map(convertChannelData);

export const convertChatMessage = (rawMessage: IRawChatMessage): IChatMessage => {
  const result: IChatMessage = {
    id: rawMessage._id || uuid(),
    type: mapMessageType(rawMessage.t),
    roomId: rawMessage.rid,
    author: {
      name: rawMessage.u.name,
      id: rawMessage.u._id,
    },
    body: rawMessage.msg,
    date: rawMessage.ts.$date,
  };
  if (rawMessage.editedAt && rawMessage.editedBy) {
    const {
      editedAt: { $date: date },
      editedBy: { username, _id: id },
    } = rawMessage;
    result.edited = {
      date,
      username,
      id,
    };
  }
  return result;
};

export const convertErrorToChatMessage = (rawMessage: IRawResponse, roomId: string): IChatMessage => {
  return {
    author: { id: 'system', name: 'system' },
    body: rawMessage.error || 'Something bad has happened',
    date: Date.now(),
    id: uuid(),
    roomId,
    type: 'error',
  };
};
