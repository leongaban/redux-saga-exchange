import * as NS from '../../namespace';
import { initial } from '../data/initial';

export function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'TRANSACTIONS:LOAD_TRANSACTIONS_SUCCESS': {
      return {
        ...state,
        transactions: action.payload,
      };
    }
    default: return state;
  }
}
