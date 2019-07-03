import * as NS from '../../namespace';
import initial from '../data/initial';

function uiReducer(state: NS.IReduxState['ui'] = initial.ui, action: NS.Action): NS.IReduxState['ui'] {
  switch (action.type) {
    case 'CONFIG:SET_THEME':
    case 'CONFIG:SAVE_THEME': {
      if (!action.payload) {
        return state;
      }
      return { ...state, theme: action.payload };
    }
    default: {
      return state;
    }
  }
}

export default uiReducer;
