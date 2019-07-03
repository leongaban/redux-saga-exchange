import { put, call, all, takeLatest } from 'redux-saga/effects';
import * as R from 'ramda';

import { IDependencies } from 'shared/types/app';
import getErrorMsg, { isApiError, getApiError } from 'shared/helpers/getErrorMsg';
import { actions as notificationActions } from 'services/notification';

import * as NS from '../../namespace';
import * as actions from '../actions';
import { ICreateForexAccountResponse, IGetForexBalanceData, IWithdrawForexResponse } from 'shared/types/requests/forex';

function getSaga(deps: IDependencies) {
  const getUseForex: NS.IGetUseForex['type'] = 'FOREX:GET_USE_FOREX';
  const setUseForex: NS.ISetUseForex['type'] = 'FOREX:SET_USE_FOREX';
  const getForexBalance: NS.IGetForexBalance['type'] = 'FOREX:GET_FOREX_BALANCE';
  const createForexAccount: NS.ICreateForexAccount['type'] = 'FOREX:CREATE_FOREX_ACCOUNT';
  const withdrawFromMT5: NS.IWithdrawFromMT5['type'] = 'FOREX:WITHDRAW_FROM_MT5';

  return function* saga() {
    yield all([
      takeLatest(getUseForex, executeGetUseForex, deps),
      takeLatest(setUseForex, executeSetUseForex, deps),
      takeLatest(getForexBalance, executeGetForexBalance, deps),
      takeLatest(createForexAccount, executeCreateForexAccount, deps),
      takeLatest(withdrawFromMT5, executeWithdrawFromMT5, deps)
    ]);
  };
}

function* executeGetUseForex({ api }: IDependencies) {
  try {
    const useForex: boolean = yield call(api.forex.getUseForex);
    yield put(actions.getUseForexSuccess(useForex));
  } catch (error) {
    const errorMsg = isApiError(error) ? getApiError(error)(R.T) : getErrorMsg(error);
    yield put(notificationActions.setNotification({ kind: 'error', text: errorMsg }));
    yield put(actions.getUseForexFail(errorMsg));
  }
}

function* executeSetUseForex({ api }: IDependencies, { payload }: NS.ISetUseForex) {
  try {
    const useForex: boolean = yield call(api.forex.setUseForex, payload);
    yield put(actions.setUseForexSuccess(useForex));
  } catch (error) {
    const errorMsg = isApiError(error) ? getApiError(error)(R.T) : getErrorMsg(error);
    yield put(notificationActions.setNotification({ kind: 'error', text: errorMsg }));
    yield put(actions.setUseForexFail(errorMsg));
  }
}

function* executeGetForexBalance({ api }: IDependencies) {
  try {
    const forexBalanceRes: IGetForexBalanceData = yield call(api.forex.getForexBalance);
    yield put(actions.getForexBalanceSuccess({
      ...forexBalanceRes
    }));
  } catch (error) {
    const errorMsg = isApiError(error) ? getApiError(error)(R.T) : getErrorMsg(error);

    if (errorMsg === '') {
      // This is how we are handling checking if the user has not created their account.
      // A 500 error is returned with an no message if user does not exist.
      // message is then set to: 'User has not created account'.
      yield put(actions.getForexBalanceSuccess({
        asset: '',
        balance: 0,
        credit: 0,
        equity: 0,
        exchangeRate: 0,
        freeMargin: 0,
        floating: 0,
        leverage: 0,
        profit: 0,
        margin: 0,
        marginLevel: 0,
        message: 'User has not created account',
        mt5LoginId: 0
      }));
    }
    else {
      yield put(notificationActions.setNotification({ kind: 'error', text: errorMsg }));
      yield put(actions.getForexBalanceFail(errorMsg));
    }
  }
}

function* executeCreateForexAccount({ api }: IDependencies, { payload }: NS.ICreateForexAccount) {
  try {
    const forexCreateAccountRes: ICreateForexAccountResponse = yield call(api.forex.createForexAccount, payload);
    const res_message = forexCreateAccountRes.message;
    yield put(actions.createForexAccountSuccess({
      message: res_message
    }));

    yield put(notificationActions.setNotification({
      kind: 'info',
      text: 'Success! Please check your email for MT5 login credentials.'
    }));
  } catch (error) {
    const genericMT5AccountError = 'There was an error creating your account, contact support.';
    yield put(notificationActions.setNotification({ kind: 'error', text: genericMT5AccountError }));
    yield put(actions.createForexAccountFail(error));
  }
}

function* executeWithdrawFromMT5({ api }: IDependencies, { payload }: NS.IWithdrawFromMT5) {
  try {
    const withdrawFromMT5Res: IWithdrawForexResponse = yield call(api.forex.withdrawFromMT5, payload);
    const res_message = withdrawFromMT5Res.message;

    yield put(actions.withdrawFromMT5Success({
      message: res_message
    }));

    yield put(notificationActions.setNotification({
      kind: 'info',
      text: 'Success! You have withdrawn from MT5.'
    }));
  } catch (error) {
    const errorMsg = isApiError(error) ? getApiError(error)(R.T) : getErrorMsg(error);
    yield put(notificationActions.setNotification({ kind: 'error', text: errorMsg }));
    yield put(actions.withdrawFromMT5Fail(error));
  }
}

export { getSaga };
