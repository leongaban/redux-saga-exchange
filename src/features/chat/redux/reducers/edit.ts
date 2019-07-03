import * as NS from '../../namespace';
import { initial } from '../initial';

export function editReducer(state: NS.IReduxState['edit'] = initial.edit, action: NS.Action): NS.IReduxState['edit'] {
  switch (action.type) {
    case 'CHAT:SUBMIT_SEARCH_FORM':
      return {
        ...state,
        messageFilter: action.payload.text,
      };
    default: return state;
  }
}
