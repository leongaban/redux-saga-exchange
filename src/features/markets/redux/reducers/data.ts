import * as NS from '../../namespace';
import { initial } from '../data/initial';

function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'MARKETS:LOAD_COMPLETED': {
      return { ...state, markets: action.payload };
    }
    case 'MARKETS:EDIT_MARKET_COMPLETED': {
      return {
        ...state,
        markets: [
          ...action.payload,
        ],
      };
    }
    default: return state;
  }
}

export default dataReducer;
