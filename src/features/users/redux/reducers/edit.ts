import * as NS from '../../namespace';
import { initial } from '../data/initial';
import { documentTypes } from 'services/user/constants';

function editReducer(state: NS.IReduxState['edit'] = initial.edit, action: NS.Action): NS.IReduxState['edit'] {
  switch (action.type) {
    case 'USERS:SET_CURRENT_USER_PROFILE': {
      return {
        ...state,
        currentProfile: {
          ...state.currentProfile!,
          ...action.payload,
        },
      };
    }
    case 'USERS:SET_USER_PROFILE_MODAL_STATE': {
      return { ...state, isUserProfilModaleShown: action.payload };
    }
    case 'USERS:SET_USERS_TABLE_TOTAL_PAGES': {
      return { ...state, usersTableTotalPages: action.payload };
    }
    case 'USERS:RESET_KYC_DOCUMENT_COMPLETED': {
      const { documents } = state.currentProfile!;
      return {
        ...state,
        currentProfile: {
          ...state.currentProfile!,
          documents: {
            ...documents,
            [documentTypes.kycForm]: [],
          }
        }
      };
    }
    case 'USERS:GET_USER_DOCUMENTS_COMPLETED': {
      return {
        ...state,
        currentProfile: {
          ...state.currentProfile!,
          documents: action.payload.documents
        }
      };
    }
    default: return state;
  }
}

export default editReducer;
