import * as R from 'ramda';

import { Action, IMessagesState } from '../../namespace';
import { IChatMessage } from 'features/chat/chatApi/namespace';

const addOrReplaceMessage = (messages: IChatMessage[], message: IChatMessage): IChatMessage[] => {
  const originalMessageIndex = messages.findIndex(msg => msg.id === message.id);
  return originalMessageIndex !== -1 ? R.update(originalMessageIndex, message, messages) : R.append(message, messages);
};

function messagesReducer(state: IMessagesState = {}, action: Action): IMessagesState {
  switch (action.type) {
    case 'CHAT:MESSAGE_DELETED': {
      const {messageId, roomId} = action.payload;
      return { ...state, [roomId]: state[roomId].filter(message => message.id !== messageId) };
    }

    case 'CHAT:MESSAGE_RECEIVED': {
      const message = action.payload;
      if (!['message', 'error'].includes(message.type)) {
        return state;
      }
      return { ...state, [message.roomId]: addOrReplaceMessage(state[message.roomId] || [], message) };
    }

    case 'CHAT:HISTORY_RECEIVED': {
      const { messages, roomId } = action.payload;
      return {
        ...state,
        [roomId]: R.sort((a, b) => a.date - b.date, messages.filter(message => message.type === 'message')),
      };
    }

    default:
      return state;
  }
}

export default messagesReducer;
