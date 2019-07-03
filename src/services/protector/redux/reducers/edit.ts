import * as NS from '../../namespace';
import initial from '../data/initial';

function editReducer(state: NS.IReduxState['edit'] = initial.edit, action: NS.Action): NS.IReduxState['edit'] {
  switch (action.type) {
    case 'PROTECTOR:SET_RETRIES_AMOUNT': {
      return {
        ...state,
        retries: action.payload,
      };
    }
    case 'PROTECTOR:SET_PROVIDER': {
      return {
        ...state,
        provider: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}

export default editReducer;
