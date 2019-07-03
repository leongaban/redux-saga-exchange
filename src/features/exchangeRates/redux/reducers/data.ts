import * as NS from '../../namespace';
import { initial } from '../data/initial';

function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'EXCHANGE_RATES:TOGGLE_FAVORITE_MARKET_STATUS_SUCCESS':
    case 'EXCHANGE_RATES:LOAD_FAVORITES_SUCCESS': {
      return {...state, favorites: action.payload};
    }
    default: return state;
  }
}

export default dataReducer;
