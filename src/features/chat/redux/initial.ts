import * as NS from '../namespace';

export const initial: NS.IReduxState = {
  data: {
    userId: null,
    status: 'offline',
    error: null,
    roomId: null,
    rooms: [],
    firstIndexOfToday: null,
    messages: {},
    currentMessageId: null,
    isCacheValid: false,
  },
  edit: {
    messageFilter: '',
  },
};
