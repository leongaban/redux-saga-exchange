import { IReduxState } from '../namespace';

const initialState: IReduxState = {
  data: {
    history: [],
    depthHistory: {
      bids: [],
      asks: [],
    },
    currentCandle: {
      close: 0,
      open: 0,
      high: 0,
      low: 0,
      ts: 0,
      volume: 0,
    },
    error: '',
  },
  ui: {
    modals: {
      indicatorsDialog: {
        isOpen: false,
      },
    },
  },
};

export default initialState;
