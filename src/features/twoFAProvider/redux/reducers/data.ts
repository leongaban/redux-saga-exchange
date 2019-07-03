import * as NS from '../../namespace';
import { initial } from '../initial';

export function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'TWO_FA_PROVIDER:SEND_VERIFICATION_CODE_SUCCESS':
    // case 'TWO_FA_PROVIDER:DISABLE_2FA_SUCCESS':
    case 'TWO_FA_PROVIDER:LOAD_SECRET_INFO_SUCCESS': {
      return {
        ...state,
        secretInfo: { ...action.payload },
      };
    }
    default: return state;
  }
}
