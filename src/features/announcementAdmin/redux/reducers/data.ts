import { initial } from './initial';
import { IReduxState, Action } from '../../namespace';

export function dataReducer(state: IReduxState['data'] = initial.data, action: Action): IReduxState['data'] {
  switch (action.type) {
    case 'ANNOUNCEMENT_ADMIN:LOAD_SUCCESS':
      return {
        ...state,
        items: action.payload,
      };
    case 'ANNOUNCEMENT_ADMIN:ADD':
      return {
        ...state,
        items: [
          { content: action.payload },
          ...state.items
        ],
        warning: true,
      };
    case 'ANNOUNCEMENT_ADMIN:EDIT':
      return {
        ...state,
        items: [...state.items.slice(0, action.payload.index),
          { content: action.payload.content },
          ...state.items.slice(action.payload.index + 1)],
        warning: true,
      };
    case 'ANNOUNCEMENT_ADMIN:REORDER': {
      const newItems = [...state.items];
      const element = newItems.splice(action.payload.oldIndex, 1)[0];
      newItems.splice(action.payload.newIndex, 0, element);

      return {
        ...state,
        items: newItems,
        warning: true,
      };
    }
    case 'ANNOUNCEMENT_ADMIN:DELETE': {
      const index = action.payload;
      return {
        ...state,
        items: state.items.filter((_, itemIndex) => itemIndex !== index),
        warning: true,
      };
    }
    case 'ANNOUNCEMENT_ADMIN:SAVE_SUCCESS':
      return {
        ...state,
        warning: false,
        isSaved: action.payload.saved
      };
    case 'ANNOUNCEMENT_ADMIN:SAVE_FAIL':
      return {
        ...state,
        warning: false,
        isSaved: false
      };
    case 'ANNOUNCEMENT_ADMIN:SHOW_EDIT_MODAL':
      return {
        ...state,
        modalIndex: action.payload
      };
    default: return state;
  }
}
