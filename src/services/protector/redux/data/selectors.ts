import { IAppReduxState } from 'shared/types/app';
import { ICommunication } from 'shared/types/redux';
import { TwoFAType } from 'shared/types/models';

import * as NS from '../../namespace';

function selectFeatureState(state: IAppReduxState): NS.IReduxState {
  if (!state.protector) {
    throw new Error('Cannot find protector feature state!');
  }

  return state.protector;
}

export function selectIsVerificationModalOpen(state: IAppReduxState): boolean {
  return selectFeatureState(state).ui.isVerificationModalOpen;
}

export function selectRetriesAmount(state: IAppReduxState): number {
  return selectFeatureState(state).edit.retries;
}

export function selectProvider(state: IAppReduxState): TwoFAType {
  return selectFeatureState(state).edit.provider;
}

export function selectVerifyCommunication(state: IAppReduxState): ICommunication {
  return selectFeatureState(state).communications.verify;
}

// TODO move this selector to config
export function selectMaxNumberOfRetries(state: IAppReduxState): number {
  return 3;
}
