import * as NS from '../../namespace';
import { initial } from '../data/initial';

function editReducer(state: NS.IReduxState['edit'] = initial.edit, action: NS.Action): NS.IReduxState['edit'] {
  switch (action.type) {
    case 'MARKETS:SET_CURRENT_MARKET': {
      return {
        ...state,
        currentMarket: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}

export default editReducer;
