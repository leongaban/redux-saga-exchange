import * as NS from '../../namespace';
import { initial } from '../data/initial';
import { applyBidDiff, applyAskDiff } from '../helpers';

export function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'ORDER_BOOK_DATA_SOURCE:APPLY_ORDER_BOOK_DIFF': {
      return {
        ...state,
        orders: {
          ask: applyAskDiff(state.orders.ask, action.payload.ask),
          bid: applyBidDiff(state.orders.bid, action.payload.bid),
        },
        askTotalAmount: action.payload.askTotalAmount,
        bidTotalAmount: action.payload.bidTotalAmount,
      };
    }
    default: return state;
  }
}
