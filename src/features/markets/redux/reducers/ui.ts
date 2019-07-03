import * as NS from '../../namespace';
import { initial } from '../data/initial';

function uiReducer(state: NS.IReduxState['ui'] = initial.ui, action: NS.Action): NS.IReduxState['ui'] {
  switch (action.type) {
    case 'MARKETS:SET_EDIT_MARKET_MODAL_STATE': {
      return {
        ...state,
        isEditMarketModalShown: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}

export default uiReducer;
