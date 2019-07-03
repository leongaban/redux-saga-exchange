
import * as NS from '../../namespace';
import { IAppReduxState } from 'shared/types/app';
import { ITwoFactorInfo } from 'shared/types/models';
import { ICommunication } from 'shared/types/redux';

function selectFeatureState(state: IAppReduxState): NS.IReduxState {
  if (!state.auth) {
    throw new Error('Cannot find auth feature state!');
  }

  return state.auth;
}

export function selectCommunicationState(
  key: keyof NS.IReduxState['communications'],
  state: IAppReduxState
): ICommunication {
  return selectFeatureState(state).communications[key];
}

export function selectTimerValue(state: IAppReduxState): number {
  return selectFeatureState(state).edit.timerValue;
}

export function selectIsTimerStarted(state: IAppReduxState): boolean {
  return selectFeatureState(state).edit.isTimerStarted;
}

export function selectIsTokenInvalid(state: IAppReduxState): boolean {
  return selectFeatureState(state).edit.isTokenInvalid;
}

export function selectTwoFactor(state: IAppReduxState): ITwoFactorInfo {
  return selectFeatureState(state).data.twoFactorInfo;
}
