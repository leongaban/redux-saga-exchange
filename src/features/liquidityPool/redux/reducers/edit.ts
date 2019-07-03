import * as NS from '../../namespace';
import { initial } from '../initial';

export function editReducer(state: NS.IReduxState['edit'] = initial.edit, action: NS.Action): NS.IReduxState['edit'] {
  switch (action.type) {
    case 'LIQUIDITY-POOL:SET_CONVERSION_CURRENCY': {
      return {
        ...state,
        conversionCurrency: action.payload,
      };
    }
    case 'LIQUIDITY-POOL:SET_ASSET_FILTER': {
      return {
        ...state,
        assetFilter: action.payload,
      };
    }
    default: return state;
  }
}
