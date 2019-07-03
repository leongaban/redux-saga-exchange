import * as NS from '../../namespace';
import initial from '../data/initial';

function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'USER:RESTORE_SESSION_COMPLETED': {
      return {
        ...state,
        user: action.payload,
        isAuthorized: true,
      };
    }
    case 'USER:RESTORE_SESSION_FAIL': {
      return {
        ...state,
        isAuthorized: false,
      };
    }
    case 'USER:LOAD_BALANCES_COMPLETED':
    case 'USER:APPLY_BALANCE_DIFF':
      return {
        ...state,
        balances: {
          ...state.balances,
          ...action.payload,
        },
      };
    case 'USER:UPDATE_DATA': {
      return {
        ...state,
        user: {
          ...state.user!,
          ...action.payload,
        },
      };
    }
    case 'USER:ADMIN_LOGIN':
    case 'USER:RESTORE_ADMIN_SESSION_SUCCESS': {
     return {
       ...state,
       isAdminAuthorized: true,
       user: action.payload
     };
    }
    case 'USER:ADMIN_LOGOUT': {
      return {
        ...state,
        isAdminAuthorized: false,
        user: null
      };
    }
    case 'USER:GET_DOCUMENT_SUCCESS': {
      return {
        ...state,
        user: {
          ...state.user!,
          kycDocuments: state.user!.kycDocuments.map(document => {
            if (document.id === action.payload.id) {
              return {
                ...document,
                ...action.payload
              };
            }
            return document;
          }),
        }
      };
    }
    case 'USERS:REMOVE_DOCUMENT_URL': {
      return {
        ...state,
        user: {
          ...state.user!,
          kycDocuments: state.user!.kycDocuments.map(document => {
            if (document.id === action.payload) {
              return {
                ...document,
                needToRefreshUrl: true,
              };
            }
            return document;
          }),
        }
      };
    }
    default: {
      return state;
    }
  }
}

export default dataReducer;
