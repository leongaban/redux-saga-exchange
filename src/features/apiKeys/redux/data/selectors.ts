
import { IApiKey } from 'shared/types/models';
import { IAppReduxState } from 'shared/types/app';
import * as NS from '../../namespace';
import { ICommunication } from 'shared/types/redux';

function selectFeatureState(state: IAppReduxState): NS.IReduxState {
  return state.apiKeys;
}

export function selectApiKeys(state: IAppReduxState): IApiKey[] {
  return selectFeatureState(state).data.apiKeys;
}

export function selectApiKeysAreRequesting(state: IAppReduxState): boolean {
  return selectFeatureState(state).communication.getApiKeys.isRequesting;
}

export function selectAddApiKey(state: IAppReduxState): ICommunication {
  return selectFeatureState(state).communication.addApiKey;
}

export function selectRemoveApiKeyIsRequesting(state: IAppReduxState): boolean {
  return selectFeatureState(state).communication.removeApiKey.isRequesting;
}
