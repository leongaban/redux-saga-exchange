import { put, call, takeLatest, all } from 'redux-saga/effects';
import { stopSubmit } from 'redux-form';
import * as R from 'ramda';

import getErrorMsg, { isApiError, getApiError } from 'shared/helpers/getErrorMsg';
import { ISecretInfo } from 'shared/types/models';
import { IDependencies } from 'shared/types/app';
import { actions as notificationActions } from 'services/notification';
import { protect } from 'services/protector';

import * as actions from '../actions';
import * as reduxFormEntries from '../reduxFormEntries';
import * as NS from '../../namespace';
import { I2FASetupRequest } from 'services/api/types';
import { IHoldingProvider } from 'shared/types/requests';

const {
  toggle2faFormEntry: { name: verificationFormName },
} = reduxFormEntries;

function getSaga(deps: IDependencies) {
  const setupSecretType: NS.ILoadSecretInfo['type'] = 'TWO_FA_PROVIDER:LOAD_SECRET_INFO';
  const sendCodeToEmail: NS.ISendCodeToEmail['type'] = 'TWO_FA_PROVIDER:SEND_CODE_TO_EMAIL';
  const sendVerificationCodeType: NS.ISendVerificationCode['type'] = 'TWO_FA_PROVIDER:SEND_VERIFICATION_CODE';
  const disable2FAType: NS.IDisable2FA['type'] = 'TWO_FA_PROVIDER:DISABLE_2FA';

  return function* saga() {
    yield all([
      takeLatest(setupSecretType, executeLoadSecretInfo, deps),
      takeLatest(sendCodeToEmail, executeSendCodeToEmail, deps),
      takeLatest(sendVerificationCodeType, executeSendVerificationCode, deps),
      takeLatest(disable2FAType, protect(executeDisable2FA), deps),
    ]);
  };
}

function* executeLoadSecretInfo({ api }: IDependencies) {
  try {
    const data: ISecretInfo = yield call(api.profile.loadSecretInfo);
    yield put(actions.loadSecretInfoSuccess(data));
  } catch (error) {
    yield put(actions.loadSecretInfoFail(getErrorMsg(error)));
  }
}

function* executeSendCodeToEmail({ api }: IDependencies) {
  try {
    const info: I2FASetupRequest = { new2FaProviderCode: '' };
    yield call(api.profile.setup2fa, info);
    yield put(actions.sendCodeToEmailSuccess());
    yield put(actions.toggleCodeFormVisibility(true));
    yield put(notificationActions.setNotification({
      kind: 'info',
      text: 'Email with verification code has been sent',
    }));
  } catch (error) {
    yield put(actions.sendCodeToEmailFail(getErrorMsg(error)));
  }
}

function* executeSendVerificationCode({ api }: IDependencies, { payload }: NS.ISendVerificationCode) {
  try {
    const data: ISecretInfo = yield call(api.profile.setup2fa, payload);
    yield put(actions.sendVerificationCodeSuccess(data));
    yield put(actions.toggleCodeFormVisibility(false));
  } catch (error) {
    const msg = isApiError(error) ? getApiError(error)(R.T) : getErrorMsg(error);
    yield put(stopSubmit(verificationFormName, { _error: msg }));
    yield put(actions.sendVerificationCodeFail(getErrorMsg(error)));
  }
}

function* executeDisable2FA({ api }: IDependencies, _: NS.IDisable2FA, code: string) {
  try {
    if (!code) {
      const withProvider: IHoldingProvider = { provider: 'Authenticator' };
      return withProvider;
    }
    const data: ISecretInfo = yield call(api.profile.setup2fa, { code, new2FaProviderCode: '' });
    yield put(actions.disable2FASuccess(data));
    yield put(notificationActions.setNotification({
      kind: 'info',
      text: 'Email with verification code has been sent',
    }));
    yield put(actions.toggleCodeFormVisibility(true));
  } catch (error) {
    if (isApiError(error)) {
      const getError = getApiError(error);
      const message = getError(R.T);
      yield put(notificationActions.setNotification({
        kind: 'error',
        text: message,
      }));
    }
    throw error;
  }
}

export { getSaga };
