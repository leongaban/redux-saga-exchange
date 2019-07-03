import * as NS from '../../namespace';
import { initial } from '../data/initial';

export function editReducer(state: NS.IReduxState['edit'] = initial.edit, action: NS.Action): NS.IReduxState['edit'] {
  switch (action.type) {
    case 'ORDER_BOOK:SET_DECIMALS': {
      return { ...state, decimals: action.payload };
    }
    default: return state;
  }
}
