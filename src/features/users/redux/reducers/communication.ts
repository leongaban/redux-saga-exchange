import { combineReducers } from 'redux';
import * as NS from '../../namespace';

import { initial } from '../data/initial';
import { ReducersMap } from 'shared/types/redux';
import makeCommunicationReducer from 'shared/helpers/redux/communication/makeCommunicationReducer';

// tslint:disable:max-line-length
export default combineReducers<NS.IReduxState['communication']>({
  loadUsersCommunication: makeCommunicationReducer<NS.ILoadUsers, NS.ILoadUsersCompleted, NS.ILoadUsersFailed>(
    'USERS:LOAD_USERS',
    'USERS:LOAD_USERS_COMPLETED',
    'USERS:LOAD_USERS_FAILED',
    initial.communication.loadUsersCommunication,
  ),
  resetKycDocumentCommunication: makeCommunicationReducer<NS.IResetKycDocument, NS.IResetKycDocumentCompleted, NS.IResetKycDocumentFailed>(
    'USERS:RESET_KYC_DOCUMENT',
    'USERS:RESET_KYC_DOCUMENT_COMPLETED',
    'USERS:RESET_KYC_DOCUMENT_FAILED',
    initial.communication.resetKycDocumentCommunication,
  ),
  getUserDocumentsCommunication: makeCommunicationReducer<NS.IGetUserDocuments, NS.IGetUserDocumentsCompleted, NS.IGetUserDocumentsFailed>(
    'USERS:GET_USER_DOCUMENTS',
    'USERS:GET_USER_DOCUMENTS_COMPLETED',
    'USERS:GET_USER_DOCUMENTS_FAILED',
    initial.communication.getUserDocumentsCommunication,
  ),
  updateProfile: makeCommunicationReducer<NS.IUpdateUserProfile, NS.IUpdateUserProfileCompleted, NS.IUpdateUserProfileFailed>(
    'USERS:UPDATE_PROFILE',
    'USERS:UPDATE_PROFILE_COMPLETED',
    'USERS:UPDATE_PROFILE_FAILED',
    initial.communication.updateProfile,
  ),
  loadUserRoles: makeCommunicationReducer<NS.ILoadUserRoles, NS.ILoadUserRolesSuccess, NS.ILoadUserRolesFail>(
    'USERS:LOAD_USER_ROLES',
    'USERS:LOAD_USER_ROLES_SUCCESS',
    'USERS:LOAD_USER_ROLES_FAIL',
    initial.communication.loadUserRoles,
  ),
  activateUser: makeCommunicationReducer<NS.IActivateUser, NS.IActivateUserSuccess, NS.IActivateUserFail>(
    'USERS:ACTIVATE_USER',
    'USERS:ACTIVATE_USER_SUCCESS',
    'USERS:ACTIVATE_USER_FAIL',
    initial.communication.activateUser,
  ),
  deactivateUser: makeCommunicationReducer<NS.IDeactivateUser, NS.IDeactivateUserSuccess, NS.IDeactivateUserFail>(
    'USERS:DEACTIVATE_USER',
    'USERS:DEACTIVATE_USER_SUCCESS',
    'USERS:DEACTIVATE_USER_FAIL',
    initial.communication.deactivateUser,
  ),
  verifyUser: makeCommunicationReducer<NS.IVerifyUser, NS.IVerifyUserSuccess, NS.IVerifyUserFail>(
    'USERS:VERIFY_USER',
    'USERS:VERIFY_USER_SUCCESS',
    'USERS:VERIFY_USER_FAIL',
    initial.communication.verifyUser,
  ),
  unlockUser: makeCommunicationReducer<NS.IUnlockUser, NS.IUnlockUserSuccess, NS.IUnlockUserFail>(
    'USERS:UNLOCK_USER',
    'USERS:UNLOCK_USER_SUCCESS',
    'USERS:UNLOCK_USER_FAIL',
    initial.communication.unlockUser,
  ),
  confirmEmail: makeCommunicationReducer<NS.IConfirmEmail, NS.IConfirmEmailSuccess, NS.IConfirmEmailFail>(
    'USERS:CONFIRM_EMAIL',
    'USERS:CONFIRM_EMAIL_SUCCESS',
    'USERS:CONFIRM_EMAIL_FAIL',
    initial.communication.confirmEmail,
  ),
  deleteUserClaim: makeCommunicationReducer<NS.IDeleteUserClaim, NS.IDeleteUserClaimSuccess, NS.IDeleteUserClaimFail>(
    'USERS:DELETE_USER_CLAIM',
    'USERS:DELETE_USER_CLAIM_SUCCESS',
    'USERS:DELETE_USER_CLAIM_FAIL',
    initial.communication.deleteUserClaim,
  ),
  loadOpenOrders: makeCommunicationReducer<NS.ILoadOpenOrders, NS.ILoadOpenOrdersSuccess, NS.ILoadOpenOrdersFail>(
    'USERS:LOAD_OPEN_ORDERS',
    'USERS:LOAD_OPEN_ORDERS_SUCCESS',
    'USERS:LOAD_OPEN_ORDERS_FAIL',
    initial.communication.loadOpenOrders,
  ),
  loadUserBalance: makeCommunicationReducer<NS.ILoadUserBalance, NS.ILoadUserBalanceSuccess, NS.ILoadUserBalanceFail>(
    'USERS:LOAD_USER_BALANCE',
    'USERS:LOAD_USER_BALANCE_SUCCESS',
    'USERS:LOAD_USER_BALANCE_FAIL',
    initial.communication.loadUserBalance,
  ),
  loadUserArchiveOrders: makeCommunicationReducer<NS.ILoadUserArchiveOrders, NS.ILoadUserArchiveOrdersCompleted, NS.ILoadUserArchiveOrdersFailed>(
    'USERS:LOAD_USER_ARCHIVE_ORDERS',
    'USERS:LOAD_USER_ARCHIVE_ORDERS_COMPLETED',
    'USERS:LOAD_USER_ARCHIVE_ORDERS_FAILED',
    initial.communication.loadUserArchiveOrders,
  ),
} as ReducersMap<NS.IReduxState['communication']>);
