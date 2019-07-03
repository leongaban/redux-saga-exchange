import { makeCommunicationActionCreators } from 'shared/helpers/redux/index';
import * as NS from '../../namespace';

export const { execute: loadUsers, completed: loadUsersCompleted, failed: loadUsersFailed } =
  makeCommunicationActionCreators<NS.ILoadUsers, NS.ILoadUsersCompleted, NS.ILoadUsersFailed>(
    'USERS:LOAD_USERS',
    'USERS:LOAD_USERS_COMPLETED',
    'USERS:LOAD_USERS_FAILED',
  );

export const { execute: resetKycDocument, completed: resetKycDocumentCompleted, failed: resetKycDocumentFailed } =
  makeCommunicationActionCreators<NS.IResetKycDocument, NS.IResetKycDocumentCompleted, NS.IResetKycDocumentFailed>(
    'USERS:RESET_KYC_DOCUMENT',
    'USERS:RESET_KYC_DOCUMENT_COMPLETED',
    'USERS:RESET_KYC_DOCUMENT_FAILED',
  );

export const { execute: getUserDocuments, completed: getUserDocumentsCompleted, failed: getUserDocumentsFailed } =
  makeCommunicationActionCreators<NS.IGetUserDocuments, NS.IGetUserDocumentsCompleted, NS.IGetUserDocumentsFailed>(
    'USERS:GET_USER_DOCUMENTS',
    'USERS:GET_USER_DOCUMENTS_COMPLETED',
    'USERS:GET_USER_DOCUMENTS_FAILED',
  );

export const { execute: updateUserProfile, completed: updateUserProfileCompleted, failed: updateUserProfileFailed } =
  makeCommunicationActionCreators<NS.IUpdateUserProfile, NS.IUpdateUserProfileCompleted, NS.IUpdateUserProfileFailed>(
    'USERS:UPDATE_PROFILE',
    'USERS:UPDATE_PROFILE_COMPLETED',
    'USERS:UPDATE_PROFILE_FAILED',
  );

export const { execute: loadUserRoles, completed: loadUserRolesSuccess, failed: loadUserRolesFail } =
  makeCommunicationActionCreators<NS.ILoadUserRoles, NS.ILoadUserRolesSuccess, NS.ILoadUserRolesFail>(
    'USERS:LOAD_USER_ROLES', 'USERS:LOAD_USER_ROLES_SUCCESS', 'USERS:LOAD_USER_ROLES_FAIL',
  );

export const { execute: activateUser, completed: activateUserSuccess, failed: activateUserFail } =
  makeCommunicationActionCreators<NS.IActivateUser, NS.IActivateUserSuccess, NS.IActivateUserFail>(
    'USERS:ACTIVATE_USER', 'USERS:ACTIVATE_USER_SUCCESS', 'USERS:ACTIVATE_USER_FAIL',
  );

export const { execute: deactivateUser, completed: deactivateUserSuccess, failed: deactivateUserFail } =
  makeCommunicationActionCreators<NS.IDeactivateUser, NS.IDeactivateUserSuccess, NS.IDeactivateUserFail>(
    'USERS:DEACTIVATE_USER', 'USERS:DEACTIVATE_USER_SUCCESS', 'USERS:DEACTIVATE_USER_FAIL',
  );

export const { execute: verifyUser, completed: verifyUserSuccess, failed: verifyUserFail } =
  makeCommunicationActionCreators<NS.IVerifyUser, NS.IVerifyUserSuccess, NS.IVerifyUserFail>(
    'USERS:VERIFY_USER', 'USERS:VERIFY_USER_SUCCESS', 'USERS:VERIFY_USER_FAIL',
  );

export const { execute: unlockUser, completed: unlockUserSuccess, failed: unlockUserFail } =
  makeCommunicationActionCreators<NS.IUnlockUser, NS.IUnlockUserSuccess, NS.IUnlockUserFail>(
    'USERS:UNLOCK_USER', 'USERS:UNLOCK_USER_SUCCESS', 'USERS:UNLOCK_USER_FAIL',
  );

export const { execute: confirmEmail, completed: confirmEmailSuccess, failed: confirmEmailFail } =
  makeCommunicationActionCreators<NS.IConfirmEmail, NS.IConfirmEmailSuccess, NS.IConfirmEmailFail>(
    'USERS:CONFIRM_EMAIL', 'USERS:CONFIRM_EMAIL_SUCCESS', 'USERS:CONFIRM_EMAIL_FAIL',
  );

export const { execute: deleteUserClaim, completed: deleteUserClaimSuccess, failed: deleteUserClaimFail } =
  makeCommunicationActionCreators<NS.IDeleteUserClaim, NS.IDeleteUserClaimSuccess, NS.IDeleteUserClaimFail>(
    'USERS:DELETE_USER_CLAIM', 'USERS:DELETE_USER_CLAIM_SUCCESS', 'USERS:DELETE_USER_CLAIM_FAIL',
  );

export const { execute: loadOpenOrders, completed: loadOpenOrdersSuccess, failed: loadOpenOrdersFail } =
  makeCommunicationActionCreators<NS.ILoadOpenOrders, NS.ILoadOpenOrdersSuccess, NS.ILoadOpenOrdersFail>(
    'USERS:LOAD_OPEN_ORDERS', 'USERS:LOAD_OPEN_ORDERS_SUCCESS', 'USERS:LOAD_OPEN_ORDERS_FAIL',
  );

export const { execute: loadUserBalance, completed: loadUserBalanceSuccess, failed: loadUserBalanceFail } =
  makeCommunicationActionCreators<NS.ILoadUserBalance, NS.ILoadUserBalanceSuccess, NS.ILoadUserBalanceFail>(
    'USERS:LOAD_USER_BALANCE', 'USERS:LOAD_USER_BALANCE_SUCCESS', 'USERS:LOAD_USER_BALANCE_FAIL',
  );

/* tslint:disable:max-line-length */
export const { execute: loadUserArchiveOrders, completed: loadUserArchiveOrdersCompleted, failed: loadUserArchiveOrdersFailed } =
  makeCommunicationActionCreators<NS.ILoadUserArchiveOrders, NS.ILoadUserArchiveOrdersCompleted, NS.ILoadUserArchiveOrdersFailed>(
    'USERS:LOAD_USER_ARCHIVE_ORDERS', 'USERS:LOAD_USER_ARCHIVE_ORDERS_COMPLETED', 'USERS:LOAD_USER_ARCHIVE_ORDERS_FAILED',
  );
