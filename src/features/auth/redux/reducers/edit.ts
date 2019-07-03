import * as NS from '../../namespace';
import initial from '../data/initial';

function editReducer(state: NS.IReduxState['edit'] = initial.edit, action: NS.Action): NS.IReduxState['edit'] {
  switch (action.type) {
    case 'AUTH:SET_TIMER_VALUE': {
      return {
        ...state,
        timerValue: action.payload,
      };
    }
    case 'AUTH:START_TIMER': {
      return {
        ...state,
        isTimerStarted: true,
        timerValue: action.payload,
      };
    }
    case 'AUTH:STOP_TIMER': {
      return {
        ...state,
        isTimerStarted: false,
        timerValue: 0,
      };
    }
    case 'AUTH:SET_IS_TOKEN_INVALID': {
      return {
        ...state,
        isTokenInvalid: action.payload,
      };
    }
    default: return state;
  }
}

export default editReducer;
