import * as NS from '../../namespace';
import { initial } from '../initial';

export function uiReducer(state: NS.IReduxState['ui'] = initial.ui, action: NS.Action): NS.IReduxState['ui'] {
  switch (action.type) {
    case 'USER_ACTIVITY_MONITORING:TOGGLE_MODAL_SESSION_EXPIRATION_STATE': {
      return {
        ...state,
        isModalSessionExpirationOpen: action.payload,
      };
    }
    default: return state;
  }
}
