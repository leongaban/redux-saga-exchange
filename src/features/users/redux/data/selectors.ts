import { IAppReduxState } from 'shared/types/app';
import {
  IAdminPanelUser, IUserRole, UsersBalance,
  IArchiveOrder, IPaginatedData, IActiveOrder,
} from 'shared/types/models';
import { ICommunication } from 'shared/types/redux';
import * as NS from '../../namespace';

function selectFeatureState(state: IAppReduxState): NS.IReduxState {
  if (!state.users) {
    throw new Error('Cannot find users feature state!');
  }

  return state.users;
}

export function selectUsers(state: IAppReduxState): IAdminPanelUser[] {
  return selectFeatureState(state).data.users;
}

export function selectCurrentUserProfile(state: IAppReduxState): IAdminPanelUser | null {
  return selectFeatureState(state).edit.currentProfile;
}

export function selectUserArchiveOrders(state: IAppReduxState): IPaginatedData<IArchiveOrder[]> {
  return selectFeatureState(state).data.archiveOrders;
}

export function isRequestingResetKycDocument(state: IAppReduxState): boolean {
  return state.users.communication.resetKycDocumentCommunication.isRequesting;
}

export function isRequestingGetDocument(state: IAppReduxState): boolean {
  return state.users.communication.getUserDocumentsCommunication.isRequesting;
}

export function selectIsUserProfileModalShown(state: IAppReduxState): boolean {
  return selectFeatureState(state).edit.isUserProfilModaleShown;
}

export function selectUserRoles(state: IAppReduxState): IUserRole[] {
  return selectFeatureState(state).data.userRoles;
}

export function selectUsersTableTotalPages(state: IAppReduxState): number {
  return selectFeatureState(state).edit.usersTableTotalPages;
}

export function selectCommunication(state: IAppReduxState, key: keyof NS.IReduxState['communication']) {
  return selectFeatureState(state).communication[key];
}

export function selectOpenOrders(state: IAppReduxState): IPaginatedData<IActiveOrder[]> {
  return selectFeatureState(state).data.openOrders;
}

export function selectUsersBalance(state: IAppReduxState): UsersBalance {
  return selectFeatureState(state).data.usersBalance;
}

export function selectLoadUserBalanceCommunication(state: IAppReduxState): ICommunication {
  return selectFeatureState(state).communication.loadUserBalance;
}
