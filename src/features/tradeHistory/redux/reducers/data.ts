import * as NS from '../../namespace';
import { initial } from '../initial';
import { applyTradesDiff } from '../helpers';

export function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'TRADE_HISTORY:LOAD_SUCCESS': {
      return {
        ...state,
        extendedTrades: action.payload.data,
      };
    }
    case 'TRADE_HISTORY:APPLY_DIFF': {
      return { ...state, trades: applyTradesDiff(action.payload, state.trades) };
    }
    default: return state;
  }
}
