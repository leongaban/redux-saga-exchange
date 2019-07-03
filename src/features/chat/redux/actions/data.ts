import * as NS from '../../namespace';
import { IChatMessage } from 'features/chat/chatApi/namespace';

export function chatError(error: string): NS.IChatError {
  return { type: 'CHAT:ERROR', payload: error };
}

export function chatConnected(): NS.IChatConnected {
  return { type: 'CHAT:CONNECTED' };
}

export function chatDisconnected(): NS.IChatDisconnected {
  return { type: 'CHAT:DISCONNECTED' };
}

export function messageReceived(message: IChatMessage): NS.IMessageReceived {
  return { type: 'CHAT:MESSAGE_RECEIVED', payload: message };
}

export function messageDeleted(messageId: string, roomId: string): NS.IMessageDeleted {
  return { type: 'CHAT:MESSAGE_DELETED', payload: { messageId, roomId } };
}

export function historyReceived(roomId: string, messages: IChatMessage[]): NS.IHistoryReceived {
  return { type: 'CHAT:HISTORY_RECEIVED', payload: { roomId, messages } };
}

export function switchRoom(roomId: string): NS.ISwitchRoom {
  return { type: 'CHAT:SWITCH_ROOM', payload: roomId };
}

export function setCurrentRoomId(roomId: string): NS.ISwitchRoomSuccess {
  return { type: 'CHAT:SET_CURRENT_ROOM_ID', payload: roomId };
}

export function joinRoom(roomId: string): NS.IJoinRoom {
  return { type: 'CHAT:JOIN_ROOM', payload: roomId };
}

export function sendMessage(): NS.ISendMessage {
  return { type: 'CHAT:SEND_MESSAGE' };
}

export function sendMessageSuccess(): NS.ISendMessageSuccess {
  return { type: 'CHAT:SEND_MESSAGE_SUCCESS' };
}

export function sendMessageFail(error: string): NS.ISendMessageFail {
  return { type: 'CHAT:SEND_MESSAGE_FAIL', error };
}

export function editMessage(message: IChatMessage): NS.IEditMessage {
  return { type: 'CHAT:EDIT_MESSAGE', payload: message };
}

export function setCacheValidity(isValid: boolean): NS.ISetCacheValidity {
  return { type: 'CHAT:SET_CACHE_VALIDITY', payload: isValid };
}
