import { IChatMessage } from 'shared/types/models/chat';
import { IChatMessageResponse } from 'services/api/types';

export function convertChatMessage(message: IChatMessageResponse): IChatMessage {
  return {
    id: message.id,
    text: message.message,
    ts: message.messageTs,
    userID: message.userId,
    avatarURL: message.avatarUrl,
    fullName: message.nickname,
  };
}
