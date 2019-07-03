import * as NS from '../../namespace';
import { initial } from '../initial';

export function editReducer(state: NS.IReduxState['edit'] = initial.edit, action: NS.Action): NS.IReduxState['edit'] {
  switch (action.type) {
    case 'USER_ACTIVITY_MONITORING:TOGGLE_USER_ACTIVITY_CHECKING': {
      return {
        ...state,
        isUserActivityCheckingStart: action.payload,
      };
    }
    case 'USER_ACTIVITY_MONITORING:SET_LAST_SERVER_ACTIVITY': {
      return {
        ...state,
        lastServerActivity: action.payload,
      };
    }
    default: return state;
  }
}
