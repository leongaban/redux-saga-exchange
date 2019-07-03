import * as R from 'ramda';

import { IAdminPanelUser } from 'shared/types/models';
import { documentTypes } from 'services/user/constants';
import * as NS from '../../namespace';
import { initial } from '../data/initial';

function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'USERS:LOAD_USERS_COMPLETED': {
      return { ...state, users: action.payload };
    }
    case 'USERS:GET_USER_DOCUMENTS_COMPLETED': {
      const { userId, documents } = action.payload;
      const userIndex = state.users.findIndex(({ id }) => id === userId);
      const user = state.users[userIndex];

      const newUser = {
        ...user,
        documents
      };
      return {
        ...state,
        users: R.update(userIndex, newUser, state.users),
      };
    }
    case 'USERS:RESET_KYC_DOCUMENT_COMPLETED': {
      const userId = action.payload;
      const userIndex = state.users.findIndex(({ id }) => id === userId);
      const user = state.users[userIndex];

      const newUser = {
        ...user,
        documents: {
          ...user.documents,
          [documentTypes.kycForm]: []
        }
      };
      return {
        ...state,
        users: R.update(userIndex, newUser, state.users),
      };
    }
    case 'USERS:UPDATE_PROFILE_COMPLETED': {
      const { user: partialUser, id } = action.payload;
      const userIndex = state.users.findIndex(user => user.id === id);
      return {
        ...state,
        users: R.update(userIndex, { ...state.users[userIndex], ...partialUser }, state.users),
      };
    }
    case 'USERS:ACTIVATE_USER_SUCCESS': {
      const userIndex = state.users.findIndex(user => user.id === action.payload);
      const updatedItem: IAdminPanelUser = {
        ...state.users[userIndex],
        isActive: true,
      };
      return {
        ...state,
        users: R.update(userIndex, updatedItem, state.users),
      };
    }
    case 'USERS:DEACTIVATE_USER_SUCCESS': {
      const userIndex = state.users.findIndex(user => user.id === action.payload);
      const updatedItem: IAdminPanelUser = {
        ...state.users[userIndex],
        isActive: false,
      };
      return {
        ...state,
        users: R.update(userIndex, updatedItem, state.users),
      };
    }
    case 'USERS:LOAD_USER_ROLES_SUCCESS': {
      return { ...state, userRoles: action.payload };
    }
    case 'USERS:LOAD_OPEN_ORDERS_SUCCESS': {
      return {
        ...state,
        openOrders: action.payload,
      };
    }
    case 'USERS:LOAD_USER_BALANCE_SUCCESS': {
      const { userID, balance } = action.payload;
      return {
        ...state,
        usersBalance: {
          ...state.usersBalance,
          [userID]: balance,
        },
      };
    }
    case 'USERS:LOAD_USER_ARCHIVE_ORDERS_COMPLETED': {
      return { ...state, archiveOrders: action.payload };
    }
    default: return state;
  }
}

export default dataReducer;
