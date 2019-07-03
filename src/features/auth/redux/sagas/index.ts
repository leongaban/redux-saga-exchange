import * as R from 'ramda';
import { IDependencies } from 'shared/types/app';
import { call, put, takeLatest, select, all, fork } from 'redux-saga/effects';
import { stopSubmit } from 'redux-form';
import { delay } from 'redux-saga';

import getErrorMsg,
{
  isApiError, isPasswordError, isTokenInvalidError, isEmailAlreadyConfirmedError,
  getApiError, isUserNotFoundError, getNicknameError,
} from 'shared/helpers/getErrorMsg';
import { ILoginInfo, ILoginCredentials } from 'shared/types/models';
import { sessionExpirationLimit } from 'shared/constants';

import { actions as userServiceActions } from 'services/user';
import { actions as notificationService } from 'services/notification';

import * as actions from '../actions';
import * as selectors from '../data/selectors';
import * as reduxFormEntries from '../data/reduxFormEntries';
import { DUPLICATE_EMAIL_ERROR_CODE } from '../../constants';
import * as NS from '../../namespace';
import validateSaga from './validateSagas';

const {
  registrationFormEntry, loginFormEntry,
  passwordRecoveryFormEntry, changePasswordFormEntry, twoFactorFormEntry,
} = reduxFormEntries;

function getSaga(deps: IDependencies) {
  const loginType: NS.ILogin['type'] = 'AUTH:LOGIN';
  const logoutType: NS.ILogout['type'] = 'AUTH:LOGOUT';
  const registerType: NS.IRegister['type'] = 'AUTH:REGISTER';
  const resetPasswordType: NS.IResetPassword['type'] = 'AUTH:RESET_PASSWORD';
  const changePasswordType: NS.IChangePassword['type'] = 'AUTH:CHANGE_PASSWORD';
  const startTimer: NS.IStartTimer['type'] = 'AUTH:START_TIMER';
  const confirmEmailType: NS.IConfirmEmail['type'] = 'AUTH:CONFIRM_EMAIL';
  const resendConfirmationEmailType: NS.IResendConfirmationEmail['type'] = 'AUTH:RESEND_CONFIRMATION_EMAIL';
  const sendTwoFactorVerificationDataType: NS.ISendTwoFactorVerificationData['type'] = 'AUTH:SEND_TWO_FACTOR_DATA';

  return function* saga() {
    yield all([
      takeLatest(loginType, executeLogin, deps),
      takeLatest(logoutType, executeLogout, deps),
      takeLatest(registerType, executeRegister, deps),
      takeLatest(resetPasswordType, executeResetPassword, deps),
      takeLatest(changePasswordType, executeChangePassword, deps),
      takeLatest(startTimer, executeStartTimer, deps),
      takeLatest(confirmEmailType, executeConfirmEmail, deps),
      takeLatest(resendConfirmationEmailType, executeResendConfirmationEmail, deps),
      takeLatest(sendTwoFactorVerificationDataType, executeSendTwoFactorVerificationData, deps),
      yield fork(validateSaga, deps),
    ]);
  };
}

function* executeLogin({ api }: IDependencies, { payload }: NS.ILogin) {
  try {
    const { email, password, remember, isAdminPanel } = payload;
    const userCredentials: ILoginCredentials = { email, password, isPersistance: remember };
    if (isAdminPanel) {
      yield call(api.auth.loginToAdminPanel, userCredentials);

      const userId = yield call(api.auth.restoreAdminSession);
      const user = yield call(api.users.loadUserProfile, userId);

      yield put(userServiceActions.adminLogin(user));
    } else {
      const data: ILoginInfo = yield call(api.auth.login, userCredentials);

      if (data.secondFactorRequired) {
        if (data.provider === 'Email') {
          yield put(notificationService.setNotification({
            kind: 'info',
            text: 'Email with verification code has been sent',
          }));
        }
        yield put(actions.setTwoFactorInfo({ isRequired: true, provider: data.provider }));
      } else {
        yield put(userServiceActions.login());
      }
    }
    yield put(actions.loginSuccess());
  } catch (error) {
    const { name, fieldNames } = loginFormEntry;
    if (isApiError(error)) {
      const getError = getApiError(error);
      if (getError(isUserNotFoundError)) {
        yield put(stopSubmit(name, {
          [fieldNames.email]: getError(isUserNotFoundError),
        }));
      } else {
        yield put(stopSubmit(name, {
          _error: getError(R.T),
        }));
      }
    } else {
      yield put(stopSubmit(name, {
        _error: getErrorMsg(error),
      }));
    }
    yield put(actions.loginFail(getErrorMsg(error)));
  }
}

function* executeLogout({ api, sockets }: IDependencies, { payload: isAdminPanel }: NS.ILogout) {
  try {
    if (isAdminPanel) {
      yield call(api.auth.logoutFromAdminPanel);
      yield put(userServiceActions.adminLogout());
    } else {
      yield call(api.auth.logout);
      yield put(userServiceActions.logout());
    }
    yield put(actions.logoutSuccess());
  } catch (error) {
    yield put(actions.logoutFail(getErrorMsg(error)));
  }
}

function* executeConfirmEmail({ api }: IDependencies, { payload }: NS.IConfirmEmail) {
  try {
    yield call(api.auth.confirmEmail, payload);
    yield put(actions.confirmEmailSuccess());
    yield put(notificationService.setNotification({
      kind: 'info',
      text: 'Confirmation was successful',
    }));
  } catch (error) {
    if (isApiError(error)) {
      const getError = getApiError(error);
      if (getError(isTokenInvalidError)) {
        yield put(actions.setIsTokenInvalid(true));
      }
      yield put(actions.confirmEmailFail(getError(R.T)));
      yield put(notificationService.setNotification({
        kind: 'error',
        text: getError(isTokenInvalidError) || getError(R.T),
      }));
    } else {
      yield put(actions.confirmEmailFail(getErrorMsg(error)));
    }
  }
}

function* executeRegister({ api }: IDependencies, { payload }: NS.IRegister) {
  try {
    const credentials = R.omit(['queryStringForUtm'], payload);
    yield call(api.auth.register, credentials, payload.queryStringForUtm, payload.captcha);
    yield put(actions.registerSuccess());
  } catch (error) {
    const { name, fieldNames } = registrationFormEntry;
    if (isApiError(error)) {
      const getError = getApiError(error);
      yield put(stopSubmit(name, {
        [fieldNames.password]: getError(isPasswordError),
        ['_error']: getError((code) => code === 'duplicate_email')
          ? DUPLICATE_EMAIL_ERROR_CODE
          : undefined,
        [fieldNames.nickname]: getNicknameError(error, payload.nickname),
      }));
    } else {
      yield put(stopSubmit(name, {
        _error: getErrorMsg(error),
      }));
    }
    yield put(actions.registerFail(getErrorMsg(error)));
  }
}

function* executeChangePassword({ api }: IDependencies, { payload }: NS.IChangePassword) {
  try {
    yield call(api.auth.changePassword, payload);
    yield put(notificationService.setNotification({
      kind: 'info',
      text: 'Password has been successfully changed',
    }));
    yield delay(1000);
    yield put(actions.changePasswordSuccess());
  } catch (error) {
    const { name } = changePasswordFormEntry;
    if (isApiError(error)) {
      const getError = getApiError(error);
      yield put(stopSubmit(name, {
        _error: getError(R.T),
      }));
    } else {
      yield put(stopSubmit(name, {
        _error: getErrorMsg(error),
      }));
    }
    yield put(actions.changePasswordFail(getErrorMsg(error)));
  }
}

function* executeResetPassword({ api }: IDependencies, { payload }: NS.IResetPassword) {
  try {
    yield call(api.auth.resetPassword, payload.email);
    yield put(actions.resetPasswordSuccess());
    yield put(notificationService.setNotification({
      kind: 'info',
      text: 'Email with reset link has been sent',
    }));
  } catch (error) {
    const { name } = passwordRecoveryFormEntry;
    if (isApiError(error)) {
      const getError = getApiError(error);
      yield put(stopSubmit(name, {
        _error: getError(R.T),
      }));
    } else {
      yield put(stopSubmit(name, {
        _error: getErrorMsg(error),
      }));
    }
    yield put(actions.resetPasswordFail(getErrorMsg(error)));
  }
}

function* executeStartTimer() {
  const startDate = new Date();
  while (yield select(selectors.selectIsTimerStarted)) {
    const timerValue = yield select(selectors.selectTimerValue);
    if (timerValue > 0) {
      const currentDate = new Date();
      const secondsPassedFromTimerStart = Math.round((currentDate.getTime() - startDate.getTime()) / 1000);
      const remainingTime = sessionExpirationLimit - secondsPassedFromTimerStart;
      yield put(actions.setTimerValue(remainingTime > 0 ? remainingTime : 0));
      yield call(delay, 1000);
    } else {
      yield put(actions.stopTimer());
    }
  }
}

function* executeResendConfirmationEmail({ api }: IDependencies, { payload }: NS.IResendConfirmationEmail) {
  try {
    yield call(api.auth.resendConfirmationEmail, payload);
    yield put(actions.resendConfirmationEmailSuccess());
    yield put(notificationService.setNotification({
      kind: 'info',
      text: 'Email with confirmation link has been sent',
    }));
  } catch (error) {
    if (isApiError(error)) {
      const getError = getApiError(error);
      if (getError(isEmailAlreadyConfirmedError)) {
        yield put(notificationService.setNotification({
          kind: 'error',
          text: 'User email already confirmed',
        }));
      }
      yield put(actions.resendConfirmationEmailFail(getError(R.T)));
    } else {
      yield put(actions.resendConfirmationEmailFail(getErrorMsg(error)));
    }
  }
}

function* executeSendTwoFactorVerificationData({ api }: IDependencies, { payload }: NS.ISendTwoFactorVerificationData) {
  try {
    yield call(api.auth.twoFactorVerify, payload);
    yield put(actions.sendTwoFactorDataSuccess());
    yield put(userServiceActions.login());
  } catch (error) {
    const { name } = twoFactorFormEntry;
    const errorText = isApiError(error) ? getApiError(error)(R.T) : getErrorMsg(error);
    yield put(stopSubmit(name));
    yield put(actions.sendTwoFactorDataFail(errorText));
    yield put(notificationService.setNotification({
      kind: 'error',
      text: errorText,
    }));
  }
}

export default getSaga;
