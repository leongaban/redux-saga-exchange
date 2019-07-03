import * as NS from '../../namespace';
import { initial } from '../initial';
import messagesReducer from './messages';
import { IChatMessage } from 'features/chat/chatApi/namespace';

function getFirstIndexOfToday(messages: IChatMessage[]): number {
  if (!messages || !messages.length) {
    return -1;
  }

  const beginningOfToday = new Date().setHours(0, 0, 0, 0);

  if (messages[messages.length - 1].date < beginningOfToday) {
    return -1;
  }

  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].date < beginningOfToday) {
      return i + 1;
    }
  }
  return -1;
}

export function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'CHAT:ERROR':
      console.warn(`CHAT ERROR: ${action.payload}`);
      return {...initial.data, error: action.payload};
    case 'CHAT:INIT':
      return { ...state, status: 'connecting' };
    case 'CHAT:LOGIN_SUCCESS':
      return { ...state, userId: action.payload.id };
    case 'CHAT:INIT_SUCCESS':
      return { ...state, status: 'online' };
    case 'CHAT:INIT_FAIL':
      return { ...state, status: 'offline', error: action.error };
    case 'CHAT:SET_CURRENT_ROOM_ID':
      return { ...state, roomId: action.payload };
    case 'CHAT:FETCH_ROOMS_SUCCESS':
      return { ...state, rooms: action.payload };
    case 'CHAT:EDIT_MESSAGE':
      return { ...state, currentMessageId: action.payload.id };
    case 'CHAT:SEND_MESSAGE_SUCCESS':
      return { ...state, currentMessageId: null };
    case 'CHAT:MESSAGE_DELETED':
    case 'CHAT:MESSAGE_RECEIVED':
    case 'CHAT:HISTORY_RECEIVED': {
      const newMessages = messagesReducer(state.messages, action);
      return {
        ...state,
        messages: newMessages,
        firstIndexOfToday: getFirstIndexOfToday(newMessages[action.payload.roomId]),
        isCacheValid: false,
      };
    }
    case 'CHAT:SET_CACHE_VALIDITY':
      return { ...state, isCacheValid: action.payload };
    default:
      return state;
  }
}
