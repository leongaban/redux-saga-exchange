import * as NS from '../../namespace';

export const initial: NS.IReduxState = {
  data: {
    orders: {
      bid: [],
      ask: [],
    },
    askTotalAmount: 0,
    bidTotalAmount: 0,
  },
};
