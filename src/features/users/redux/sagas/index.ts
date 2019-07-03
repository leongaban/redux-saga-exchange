import { stopSubmit } from 'redux-form';

import { IDependencies } from 'shared/types/app';
import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import getErrorMsg from 'shared/helpers/getErrorMsg';
import {
  IAdminPanelUser,
  IUserRole,
  IPaginatedData,
  IDocuments,
  ICurrencyBalance,
  IArchiveOrder,
  IActiveOrder,
} from 'shared/types/models';
import { actions as notificationActions } from 'services/notification';

import * as actions from '../actions';
import * as selectors from '../data/selectors';
import { reduxFormEntries } from '../../redux';
import * as NS from '../../namespace';

const loadUsersType: NS.ILoadUsers['type'] = 'USERS:LOAD_USERS';
const updateUserProfileType: NS.IUpdateUserProfile['type'] = 'USERS:UPDATE_PROFILE';
const resetKycDocumentType: NS.IResetKycDocument['type'] = 'USERS:RESET_KYC_DOCUMENT';
const loadUserRolesType: NS.ILoadUserRoles['type'] = 'USERS:LOAD_USER_ROLES';
const activateUserType: NS.IActivateUser['type'] = 'USERS:ACTIVATE_USER';
const deactivateUserType: NS.IDeactivateUser['type'] = 'USERS:DEACTIVATE_USER';
const verifyUserType: NS.IVerifyUser['type'] = 'USERS:VERIFY_USER';
const unlockUserType: NS.IUnlockUser['type'] = 'USERS:UNLOCK_USER';
const confirmEmailType: NS.IConfirmEmail['type'] = 'USERS:CONFIRM_EMAIL';
const deleteUserClaimType: NS.IDeleteUserClaim['type'] = 'USERS:DELETE_USER_CLAIM';
const getUserDocumentsType: NS.IGetUserDocuments['type'] = 'USERS:GET_USER_DOCUMENTS';
const loadOpenOrdersType: NS.ILoadOpenOrders['type'] = 'USERS:LOAD_OPEN_ORDERS';
const loadUserBalanceType: NS.ILoadUserBalance['type'] = 'USERS:LOAD_USER_BALANCE';
const loadUserArchiveOrdersType: NS.ILoadUserArchiveOrders['type'] = 'USERS:LOAD_USER_ARCHIVE_ORDERS';

function getSaga(deps: IDependencies) {

  return function* saga() {
    yield all([
      takeLatest(loadUsersType, executeLoadUsers, deps),
      takeLatest(updateUserProfileType, executeUpdateUserProfile, deps),
      takeLatest(resetKycDocumentType, executeResetKycDocument, deps),
      takeLatest(loadUserRolesType, executeLoadUserRoles, deps),
      takeLatest(activateUserType, executeActivateUser, deps),
      takeLatest(deactivateUserType, executeDeactivateUser, deps),
      takeLatest(verifyUserType, executeVerifyUser, deps),
      takeLatest(unlockUserType, executeUnlockUser, deps),
      takeLatest(confirmEmailType, executeConfirmEmail, deps),
      takeLatest(deleteUserClaimType, executeDeleteUserClaim, deps),
      takeLatest(getUserDocumentsType, executeGetDocuments, deps),
      takeLatest(loadOpenOrdersType, executeLoadOpenOrders, deps),
      takeLatest(loadUserBalanceType, executeLoadUserBalance, deps),
      takeLatest(loadUserArchiveOrdersType, executeLoadUserArchiveOrders, deps),
    ]);
  };
}

function* executeLoadUsers({ api }: IDependencies, { payload }: NS.ILoadUsers) {
  try {
    const requiredPage: IPaginatedData<IAdminPanelUser[]> = yield call(api.users.load, payload);
    yield put(actions.loadUsersCompleted(requiredPage.data));
    yield put(actions.setUsersTableTotalPages(requiredPage.pagination.total));
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.loadUsersFailed(message));
  }
}

function* executeUpdateUserProfile({ api }: IDependencies, { payload }: NS.IUpdateUserProfile) {
  try {
    const currentProfile: ReturnType<typeof selectors.selectCurrentUserProfile>
      = yield select(selectors.selectCurrentUserProfile);

    if (currentProfile === null) {
      console.warn('currentProfile is not initialized yet');
      return;
    }

    const updatedProfile: IAdminPanelUser = {
      ...currentProfile,
      ...payload,
    };
    const prevRole = currentProfile.roles[0];
    const currRole = updatedProfile.roles[0];
    yield call(api.users.updateUserProfile, updatedProfile);
    if (prevRole !== currRole) {
      if (prevRole) {
        yield call(api.users.removeRole, updatedProfile.id, prevRole);
      }
      if (currRole) {
        yield call(api.users.addRole, updatedProfile.id, currRole);
      }
    }
    if (currentProfile.twoFactorEnabled !== updatedProfile.twoFactorEnabled) {
      if (updatedProfile.twoFactorEnabled) {
        yield call(api.users.enable2FA, updatedProfile.id);
      } else {
        yield call(api.users.disable2FA, updatedProfile.id);
      }
    }
    yield put(actions.updateUserProfileCompleted({ id: updatedProfile.id, user: updatedProfile }));
    yield put(actions.setUserProfileModalState(false));
  } catch (error) {
    const { usersFormEntry: { name } } = reduxFormEntries;
    const message = getErrorMsg(error);
    yield put(stopSubmit(name, { _error: message }));
    yield put(actions.updateUserProfileFailed(message));
    yield put(notificationActions.setNotification({
      kind: 'error',
      text: message,
    }));
  }
}

function* executeResetKycDocument(
  { api }: IDependencies,
  { payload: { userId, documentId } }: NS.IResetKycDocument
) {
  try {
    yield call(api.users.resetKycDocument, userId, documentId);
    yield put(actions.resetKycDocumentCompleted(userId));
  } catch (error) {
    yield put(actions.resetKycDocumentFailed(getErrorMsg(error)));
  }
}

function* executeGetDocuments({ api }: IDependencies, { payload: userId }: NS.IGetUserDocuments) {
  try {
    const documents: IDocuments = yield call(api.users.getUserDocuments, userId);
    yield put(actions.getUserDocumentsCompleted({ userId, documents }));
  } catch (error) {
    yield put(actions.getUserDocumentsFailed(getErrorMsg(error)));
  }
}

function* executeLoadUserRoles({ api }: IDependencies) {
  try {
    const data: IUserRole[] = yield call(api.users.loadUserRoles);
    yield put(actions.loadUserRolesSuccess(data));
  } catch (error) {
    yield put(actions.loadUserRolesFail(getErrorMsg(error)));
  }
}

function* executeActivateUser({ api }: IDependencies, { payload }: NS.IActivateUser) {
  try {
    yield call(api.users.activateUser, payload);
    yield put(actions.activateUserSuccess(payload));
  } catch (error) {
    yield put(actions.activateUserFail(getErrorMsg(error)));
  }
}

function* executeDeactivateUser({ api }: IDependencies, { payload }: NS.IDeactivateUser) {
  try {
    yield call(api.users.deactivateUser, payload);
    yield put(actions.deactivateUserSuccess(payload));
  } catch (error) {
    yield put(actions.deactivateUserFail(getErrorMsg(error)));
  }
}

function* executeVerifyUser({ api }: IDependencies, { payload: isVerified }: NS.IVerifyUser) {
  try {
    const currentProfile: ReturnType<typeof selectors.selectCurrentUserProfile>
      = yield select(selectors.selectCurrentUserProfile);

    if (currentProfile === null) {
      console.warn('currentProfile is not initialized yet');
      return;
    }

    if (!isVerified) {
      yield call(api.users.verify, currentProfile.id);
    } else {
      yield call(api.users.unverify, currentProfile.id);
    }
    yield put(actions.updateUserProfileCompleted({ id: currentProfile.id, user: { isVerified: !isVerified } }));
    yield put(actions.setCurrentUserProfile({ ...currentProfile, isVerified: !isVerified }));
    yield put(actions.verifyUserSuccess());
  } catch (error) {
    yield put(actions.verifyUserFail(getErrorMsg(error)));
  }
}

function* executeUnlockUser({ api }: IDependencies, { payload: userId }: NS.IUnlockUser) {
  try {
    yield call(api.users.unlockUser, userId);
    yield put(actions.setCurrentUserProfile({ lockoutEnd: '' }));
    yield put(actions.updateUserProfileCompleted({ id: userId, user: { lockoutEnd: '' } }));
    yield put(actions.unlockUserSuccess());
  } catch (error) {
    yield put(actions.unlockUserFail(getErrorMsg(error)));
  }
}

function* executeConfirmEmail({ api }: IDependencies, { payload: userId }: NS.IConfirmEmail) {
  try {
    yield call(api.users.confirmEmail, userId);
    yield put(actions.setCurrentUserProfile({ isEmailConfirmed: true }));
    yield put(actions.updateUserProfileCompleted({ id: userId, user: { isEmailConfirmed: true } }));
    yield put(actions.confirmEmailSuccess());
  } catch (error) {
    yield put(actions.confirmEmailFail(getErrorMsg(error)));
  }
}

function* executeDeleteUserClaim({ api }: IDependencies, { payload: claimId }: NS.IDeleteUserClaim) {
  try {
    const currentProfile: ReturnType<typeof selectors.selectCurrentUserProfile>
      = yield select(selectors.selectCurrentUserProfile);

    if (currentProfile === null) {
      console.warn('currentProfile is not initialized yet');
      return;
    }
    yield call(api.users.deleteUserClaim, currentProfile.id, claimId);
    const claims = currentProfile.claims.filter(claim => claim.id !== claimId);
    yield put(actions.setCurrentUserProfile({ claims }));
    yield put(actions.updateUserProfileCompleted({ id: currentProfile.id, user: { claims } }));
    yield put(actions.deleteUserClaimSuccess());
  } catch (error) {
    yield put(actions.deleteUserClaimFail(getErrorMsg(error)));
  }
}

function* executeLoadOpenOrders({ api }: IDependencies, { payload }: NS.ILoadOpenOrders) {
  try {
    const orders: IPaginatedData<IActiveOrder[]> = yield call(api.orders.loadUserOpenOrders, payload);
    yield put(actions.loadOpenOrdersSuccess(orders));
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(notificationActions.setNotification({
      kind: 'error',
      text: message,
    }));
    yield put(actions.loadOpenOrdersFail(message));
  }
}

function* executeLoadUserBalance({ api }: IDependencies, { payload: userID }: NS.ILoadUserBalance) {
  try {
    const balance: ICurrencyBalance[] = yield call(api.users.loadUserBalance, userID);
    yield put(actions.loadUserBalanceSuccess({ userID, balance }));

  } catch (error) {
    const message = getErrorMsg(error);
    yield put(notificationActions.setNotification({
      kind: 'error',
      text: message,
    }));
    yield put(actions.loadUserBalanceFail(message));
  }
}

function* executeLoadUserArchiveOrders({ api }: IDependencies, { payload }: NS.ILoadUserArchiveOrders) {
  try {
    const { pagination: { total: currentTotalPages } }: IPaginatedData<IArchiveOrder[]>
      = yield select(selectors.selectUserArchiveOrders);
    if (payload.page <= currentTotalPages) {
      const [requiredPage, nextPage]: Array<IPaginatedData<IArchiveOrder[]>> = yield all([
        call(api.orders.loadPagedArchiveOfOrdersForUser, payload),
        call(api.orders.loadPagedArchiveOfOrdersForUser, { ...payload, page: payload.page + 1 }),
      ]);

      // server cant count total pages for this query, that's why we assume that total,
      // if next page exist === at least equal to next page, ottherwise current is last one
      const totalPages = nextPage.data.length !== 0 ? nextPage.pagination.page : requiredPage.pagination.page;
      yield put(actions.loadUserArchiveOrdersCompleted({
        ...requiredPage,
        pagination: { ...requiredPage.pagination, total: totalPages },
      }));

    } else {
      const orders: IPaginatedData<IArchiveOrder[]> = yield call(api.orders.loadPagedArchiveOfOrdersForUser, payload);
      yield put(actions.loadUserArchiveOrdersCompleted({
        ...orders,
        pagination: { ...orders.pagination, total: orders.pagination.page }
      }));
    }
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.loadUserArchiveOrdersFailed(message));
  }
}

export default getSaga;
