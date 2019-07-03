import { IAppReduxState } from 'shared/types/app';
import * as NS from '../namespace';
import { ICommunication } from 'shared/types/redux';
import { ISecretInfo } from 'shared/types/models';

export function getFeatureState(state: IAppReduxState): NS.IReduxState {
  return state.twoFAProvider;
}

export function selectSecretInfo(state: IAppReduxState): ISecretInfo | null {
  return getFeatureState(state).data.secretInfo;
}

export function selectCommunication(state: IAppReduxState, key: keyof NS.IReduxState['communication']): ICommunication {
  return getFeatureState(state).communication[key];
}

export function selectShouldShowVerificationForm(state: IAppReduxState): boolean {
  return getFeatureState(state).ui.isShowVerificationForm;
}
