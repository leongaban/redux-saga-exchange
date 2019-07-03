import * as NS from '../../namespace';
import { initial } from '../initial';

export function uiReducer(state: NS.IReduxState['ui'] = initial.ui, action: NS.Action): NS.IReduxState['ui'] {
  switch (action.type) {
    case 'TWO_FA_PROVIDER:TOGGLE_Code_FORM_VISIBILITY': {
      return {
        ...state,
        isShowVerificationForm: action.payload,
      };
    }
    default: return state;
  }
}
