import * as NS from '../../namespace';
import { initial } from '../data/initial';

function editReducer(state: NS.IReduxState['edit'] = initial.edit, action: NS.Action): NS.IReduxState['edit'] {
  switch (action.type) {
    case 'ORDERS:SET_CURRENT_ORDER': {
      return {
        ...state,
        currentOrder: action.payload,
      };
    }
    default: return state;
  }
}

export default editReducer;
