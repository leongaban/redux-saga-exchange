import * as NS from '../../namespace';
import { initial } from '../initial';

export function editReducer(state: NS.IReduxState['edit'] = initial.edit, action: NS.Action): NS.IReduxState['edit'] {
  switch (action.type) {
    case 'TRADE_HISTORY:SET_EXTENDED_TRADES_TOTAL_PAGES':
      return {
        ...state,
        extendedTradesTotalPages: action.payload,
      };
    default: return state;
  }
}
