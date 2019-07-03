import * as NS from '../../namespace';
import { initial } from '../initial';

function editReducer(state: NS.IReduxState['edit'] = initial.edit, action: NS.Action): NS.IReduxState['edit'] {
  switch (action.type) {
    case 'ASSETS:SET_CONVERSION_CURRENCY':
      return {
        ...state,
        conversionCurrency: action.payload,
      };
    case 'ASSETS:SET_CURRENT_ASSET': {
      return {
        ...state,
        currentAsset: action.payload,
      };
    }
    default: return state;
  }
}

export { editReducer };
