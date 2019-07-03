import { createSelector } from 'reselect';
import * as R from 'ramda';

import { IAppReduxState } from 'shared/types/app';
import { ICommunication } from 'shared/types/redux';
import { IUser, IBalanceDict, Role } from 'shared/types/models';
import { selectors as configSelectors } from 'services/config';

import * as NS from '../../namespace';

function selectFeatureState(state: IAppReduxState): NS.IReduxState {
  if (!state.user) {
    throw new Error('Cannot find user service state!');
  }

  return state.user;
}

export function selectUser(state: IAppReduxState): IUser | null {
  return selectFeatureState(state).data.user;
}

export function selectUserID(state: IAppReduxState): string | null {
  const user = selectUser(state);
  return user ? user.id : null;
}

export function selectIsAuthorized(state: IAppReduxState): boolean {
  return selectFeatureState(state).data.isAuthorized;
}

export function selectIsAdminAuthorized(state: IAppReduxState): boolean {
  return selectFeatureState(state).data.isAdminAuthorized;
}

export function selectSessionRestoring(state: IAppReduxState): ICommunication {
  return selectFeatureState(state).communications.sessionRestoring;
}

export function selectIsAdminSessionRestoring(state: IAppReduxState): ICommunication {
  return selectFeatureState(state).communications.restoreAdminSession;
}

export function selectIsVerified(state: IAppReduxState): boolean {
  const user = selectUser(state);
  return user ? user.isVerified : false;
}

export function selectUserRoles(state: IAppReduxState): Role[] | null {
  const user = selectUser(state);
  return user ? user.roles : null;
}

export const selectBalanceDict = createSelector(
  (state: IAppReduxState) => selectFeatureState(state).data.balances,
  configSelectors.selectAssetsInfo,
  (balancesDict, assetsInfo) => {
    const assetsBalances: IBalanceDict = R.map(asset => 0, assetsInfo);
    return {
      ...assetsBalances,
      ...balancesDict,
    };
  },
);
