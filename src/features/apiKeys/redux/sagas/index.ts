import { put, takeLatest, call, all } from 'redux-saga/effects';

import getErrorMsg from 'shared/helpers/getErrorMsg';
import { IDependencies } from 'shared/types/app';
import { actions as notificationService } from 'services/notification';
import { ICreateApiKeyRequest, IApiKey } from 'shared/types/models';

import * as actions from '../actions';
import * as NS from '../../namespace';

function getSaga(deps: IDependencies) {
  const getApiKeysType: NS.IGetApiKeys['type'] = 'API_KEYS:GET_API_KEYS';
  const addApiKeyType: NS.IAddApiKey['type'] = 'API_KEYS:ADD_API_KEY';
  const removeApiKeyType: NS.IRemoveApiKey['type'] = 'API_KEYS:REMOVE_API_KEY';

  return function* saga() {
    yield all([
      takeLatest(getApiKeysType, executeGetApiKeys, deps),
      takeLatest(addApiKeyType, executeAddApiKey, deps),
      takeLatest(removeApiKeyType, executeRemoveApiKey, deps),
    ]);
  };
}

function* executeGetApiKeys({ api }: IDependencies) {
  try {
    const response: IApiKey[] = yield call(api.profile.fetchApiKeys);
    yield put(actions.getApiKeysSuccess(response));
  } catch (error) {
    yield put(actions.getApiKeysFail(getErrorMsg(error)));
    yield put(notificationService.setNotification({
      kind: 'error',
      text: 'Something went wrong with fetching existing API keys. Please try later.',
    }));
  }
}

function* executeAddApiKey({ api }: IDependencies, { payload }: NS.IAddApiKey) {
  try {
    const requestData: ICreateApiKeyRequest = {
      name: payload.label,
      isInfo: payload.readAccess,
      isTrade: payload.trading,
      isWithdraw: payload.withdrawal,
      ipWhiteList: payload.ipAddressList.filter(item => item)
    };
    const response: IApiKey = yield call(api.profile.addApiKey, requestData);
    yield put(actions.addApiKeySuccess(response));
  } catch (error) {
    yield put(actions.addApiKeyFail(getErrorMsg(error)));
    yield put(notificationService.setNotification({
      kind: 'error',
      text: 'Something went wrong with adding new API key. Please try later.',
    }));
  }
}

function* executeRemoveApiKey({ api }: IDependencies, { payload: publicKey }: NS.IRemoveApiKey) {
  try {
    yield call(api.profile.removeApiKey, publicKey);
    yield put(actions.removeApiKeySuccess(publicKey));
  } catch (error) {
    yield put(actions.removeApiKeyFail(getErrorMsg(error)));
    yield put(notificationService.setNotification({
      kind: 'error',
      text: 'Something went wrong with removing API key. Please try later.',
    }));
  }
}

export { getSaga };
