
import { ICommunication } from 'shared/types/redux';
import { IAppReduxState } from 'shared/types/app';
import * as NS from '../../namespace';

export function getFeatureState(state: IAppReduxState): NS.IReduxState {
  return state.profile;
}

export function selectCroppAvatarModalState(state: IAppReduxState): NS.ICroppAvaratModal {
  return getFeatureState(state).ui.croppAvatarModalState;
}

export function selectUploadProgress(state: IAppReduxState): number {
  return getFeatureState(state).edit.uploadProgress;
}

export function selectCommunication(state: IAppReduxState, key: keyof NS.IReduxState['communication']): ICommunication {
  return getFeatureState(state).communication[key];
}
