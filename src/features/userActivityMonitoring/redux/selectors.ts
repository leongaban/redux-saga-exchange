import { IAppReduxState } from 'shared/types/app';
import * as NS from '../namespace';

export function getFeatureState(state: IAppReduxState): NS.IReduxState {
  return state.userActivityMonitoring;
}

export function selectIsUserActivityCheckingStart(state: IAppReduxState): boolean {
  return getFeatureState(state).edit.isUserActivityCheckingStart;
}

export function selectLastServerActivity(state: IAppReduxState): number | null {
  return getFeatureState(state).edit.lastServerActivity;
}

export function selectIsModalSessionExpirationOpen(state: IAppReduxState): boolean {
  return getFeatureState(state).ui.isModalSessionExpirationOpen;
}
