import * as NS from '../../namespace';
import { initial } from '../data/initial';

export function editReducer(state: NS.IReduxState['edit'] = initial.edit, action: NS.Action): NS.IReduxState['edit'] {
  switch (action.type) {
    case 'PROFILE:SET_UPLOAD_PROGRESS': {
      return {
        ...state,
        uploadProgress: action.payload,
      };
    }
    case 'PROFILE:UPLOAD_DOCUMENT_SUCCESS':
    case 'PROFILE:UPLOAD_IMAGE_SUCCESS':
    case 'PROFILE:UPLOAD_DOCUMENT_FAIL':
    case 'PROFILE:UPLOAD_IMAGE_FAIL': {
      return {
        ...state,
        uploadProgress: 0,
      };
    }
    default: return state;
  }
}
