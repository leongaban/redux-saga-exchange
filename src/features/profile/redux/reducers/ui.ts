import * as NS from '../../namespace';
import { initial } from '../data/initial';

export function uiReducer(state: NS.IReduxState['ui'] = initial.ui, action: NS.Action): NS.IReduxState['ui'] {
  switch (action.type) {
    case 'PROFILE:SET_CROPP_AVATAR_STATE': {
      return {
        ...state,
        croppAvatarModalState: action.payload,
      };
    }
    default: return state;
  }
}
