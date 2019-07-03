import { put, call, takeLatest, all, select } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { stopSubmit, reset } from 'redux-form';
import * as R from 'ramda';

import { twoFAProviderName } from 'shared/constants';
import { IDependencies } from 'shared/types/app';
import getErrorMsg, { isApiError, getFieldError, getApiError } from 'shared/helpers/getErrorMsg';
import { actions as notificationActions } from 'services/notification';
import { selectors as configSelectors, actions as configActions } from 'services/config';
import { protect } from 'services/protector/redux';
import {
  IHoldingProvider, IWithdrawToLPRequest, IWithdrawToForexRequest, PaymentSystem
} from 'shared/types/requests';
import {
  IUserConfig,
  ISavedWithdrawalAddress,
  ISavedWithdrawalAddresses,
  IDepositAddressData,
  IHoldingTheme
} from 'shared/types/models';

import * as NS from '../../namespace';
import * as actions from '../actions';
import { withdrawCoinsFormEntry } from '../reduxFormEntries';
import { UITheme } from 'shared/types/ui';

function isWithdrawToLPRequest(x: any): x is (IWithdrawToLPRequest) {
  const y = x as (IWithdrawToLPRequest);
  return y && y.paymentSystem !== void 0 && y.paymentSystem === 'LiquidityPool';
}

function isWithdrawToFXRequest(x: any): x is (IWithdrawToForexRequest) {
  const y = x as (IWithdrawToForexRequest);
  return y && y.paymentSystem !== void 0 && y.paymentSystem === '8';
}

function* executeLoadDepositAddressSaga({ api }: IDependencies, { payload: { currencyCode } }: NS.ILoadDepositAddress) {
  try {
    const response: IDepositAddressData = yield call(api.balance.loadDepositAddress, currencyCode.toLowerCase());
    yield put(actions.loadDepositAddressCompleted(response));
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.loadDepositAddressFailed(message));

    if (isApiError(error)) {
      const getError = R.curry(getFieldError)(error.errors);
      yield put(notificationActions.setNotification({ kind: 'error', text: getError(R.T) }));
    }
  }
}

const paymentSystems: { [key: string]: PaymentSystem } = {
  xlm: PaymentSystem.Stellar,
  eos: PaymentSystem.EOS,
  eth: PaymentSystem.Ethereum,
  neo: PaymentSystem.NEO,
  gas: PaymentSystem.GAS,
};

function* executeWithdrawCoinsSaga({ api }: IDependencies, { payload }: NS.IWithdrawCoins, code?: string) {
  const formEntry = withdrawCoinsFormEntry;
  try {
    if (Object.keys(paymentSystems).includes(payload.assetId)) {
      // because we should leave paymentSystem = 8 in case of withdraw for FX
      if (payload.paymentSystem !== '8') {
        payload.paymentSystem = paymentSystems[payload.assetId];
      }
    }
    const result: IHoldingProvider | void = yield call(api.balance.withdrawCoins, payload, code);
    yield put(actions.withdrawCoinsCompleted());
    if (result && result.provider) {
      if (result.provider === 'Authenticator') {
        return result;
      } else {
        const notificationText = `Verification link has been sent to your ${twoFAProviderName[result.provider]}`;
        yield put(notificationActions.setNotification({ kind: 'info', text: notificationText }));
        yield put(actions.setModalProps({
          name: 'withdrawCoins',
          props: { isOpen: false, currencyCode: null }
        }));
        return 'break';
      }
    }

    yield put(actions.setModalProps({
      name: 'withdrawCoins',
      props: { isOpen: false, currencyCode: null }
    }));

    const successNotificationText = (() => {
      if (isWithdrawToLPRequest(payload)) {
        return 'Success!  Your TIOx are now loaned to the LP';
      } else if (isWithdrawToFXRequest(payload)) {
        return 'Deposit into MT5 successful';
      } else {
        return 'Withdraw succeeded';
      }
    })();
    yield put(notificationActions.setNotification({ kind: 'info', text: successNotificationText }));

    yield put(reset(formEntry.name));
  } catch (error) {
    const message = getErrorMsg(error);
    if (isApiError(error)) {
      const isAddressError = getApiError(error)((x) => x === 'invalid_address');
      if (isAddressError) {
        const addressError = 'Invalid withdraw address';
        yield put(stopSubmit(formEntry.name, { address: addressError }));
        yield put(notificationActions.setNotification({ kind: 'error', text: addressError }));
      } else {
        const getError = R.curry(getFieldError)(error.errors);
        yield put(stopSubmit(formEntry.name, { _error: getError(R.T) }));
        yield put(notificationActions.setNotification({ kind: 'error', text: getError(R.T) }));
      }
    } else {
      yield put(stopSubmit(formEntry.name, { _error: message }));
    }

    yield put(actions.withdrawCoinsFailed(message));
    return 'break';
  }
}

function* executeWithdrawCoinsVerifySaga({ api }: IDependencies, action: NS.IWithdrawCoinsVerify, code?: string) {
  try {
    yield call(api.balance.withdrawCoins, action.payload, code);
    yield put(actions.withdrawCoinsCompleted());
    const successNotificationText = (() => {
      if (action.payload.paymentSystem === 7) {
        return 'Success!  Your TIOx are now loaned to the LP';
      } else {
        return 'Withdraw succeeded';
      }
    })();
    yield put(notificationActions.setNotification({ kind: 'info', text: successNotificationText }));
  } catch (error) {
    const message = getErrorMsg(error);

    if (isApiError(error)) {
      const getError = R.curry(getFieldError)(error.errors);
      yield put(notificationActions.setNotification({ kind: 'error', text: getError(R.T) }));
    } else {
      yield put(notificationActions.setNotification({ kind: 'error', text: message }));
    }

    yield put(actions.withdrawCoinsFailed(message));
    throw error;
  }
}

function* executeSaveAddressSaga({ api }: IDependencies, { payload }: NS.ISaveWithdrawalAddress) {
  // should be replaced with a separate api in the future
  const formEntry = withdrawCoinsFormEntry;
  const storedConfig: IUserConfig | null = yield select(configSelectors.selectUserConfig);
  const theme: UITheme = yield select(configSelectors.selectUITheme);

  if (storedConfig === null) {
    console.warn('Trying to save new withdrawal address, but userConfig is not initialized yet', payload);
    return;
  }

  const savedWithdrawalAddresses: ISavedWithdrawalAddresses =
    yield select(configSelectors.selectSavedWithdrawalAddresses);
  const newSavedAddresses: ISavedWithdrawalAddresses = (() => {
    const { currencyCode, address } = payload;
    const areSavedAddressesExist = Object.keys(savedWithdrawalAddresses).length > 0;
    if (areSavedAddressesExist) {
      const savedAddressesForCurrency: ISavedWithdrawalAddress[] = savedWithdrawalAddresses[currencyCode];
      return {
        ...savedWithdrawalAddresses,
        [currencyCode]: savedAddressesForCurrency
          ? [...savedAddressesForCurrency, address]
          : [address]
      };
    } else {
      return {
        [currencyCode]: [address],
      };
    }
  })();
  const newConfig: IUserConfig & IHoldingTheme = {
    ...storedConfig,
    theme,
    savedWithdrawalAddresses: newSavedAddresses,
  };
  try {
    yield call(api.config.setUserConfig, newConfig);
    yield put(actions.saveWithdrawalAddressCompleted(payload));
    yield put(configActions.setUserConfig({ savedWithdrawalAddresses: newSavedAddresses }));
  } catch (error) {
    const message = getErrorMsg(error);
    if (isApiError(error)) {
      const getError = R.curry(getFieldError)(error.errors);
      yield put(notificationActions.setNotification({ kind: 'error', text: getError(R.T) }));
      yield put(stopSubmit(formEntry.name, { _error: getError(R.T) }));
    } else {
      yield put(stopSubmit(formEntry.name, { _error: message }));
    }
    yield put(actions.saveWithdrawalAddressFailed(message));
  }
}

function* executeDeleteAddressSaga({ api }: IDependencies, { payload }: NS.IDeleteWithdrawalAddress) {
  // should be replaced with a separate api in the future
  const formEntry = withdrawCoinsFormEntry;
  const storedConfig: IUserConfig | null = yield select(configSelectors.selectUserConfig);
  const theme: UITheme = yield select(configSelectors.selectUITheme);

  if (storedConfig === null) {
    console.warn('Trying to delete saved withdrawal address, but userConfig is not initialized yet', payload);
    return;
  }

  const savedWithdrawalAddresses: ISavedWithdrawalAddresses =
    yield select(configSelectors.selectSavedWithdrawalAddresses);
  const areSavedAddressesExist = Object.keys(savedWithdrawalAddresses).length > 0;
  if (areSavedAddressesExist) {
    const { currencyCode, address } = payload;
    const addressLabel = Object.keys(address)[0];
    const addressValue = Object.values(address)[0];

    const addressToDelete = R.find(R.propEq(addressLabel, addressValue), savedWithdrawalAddresses[currencyCode]);
    const newSavedAddressesForCurrency = R.without([addressToDelete], savedWithdrawalAddresses[currencyCode]);

    const newSavedAddresses = {
      ...savedWithdrawalAddresses,
      [currencyCode]: newSavedAddressesForCurrency,
    };

    const newConfig: IUserConfig & IHoldingTheme = {
      ...storedConfig,
      theme,
      savedWithdrawalAddresses: newSavedAddresses,
    };
    try {
      yield call(api.config.setUserConfig, newConfig);
      yield put(actions.deleteWithdrawalAddressCompleted(newSavedAddresses));
      yield put(configActions.setUserConfig({ savedWithdrawalAddresses: newSavedAddresses }));
    } catch (error) {
      const message = getErrorMsg(error);
      if (isApiError(error)) {
        const getError = R.curry(getFieldError)(error.errors);
        yield put(notificationActions.setNotification({ kind: 'error', text: getError(R.T) }));
        yield put(stopSubmit(formEntry.name, { _error: getError(R.T) }));
      } else {
        yield put(stopSubmit(formEntry.name, { _error: message }));
      }
      yield put(actions.deleteWithdrawalAddressFailed(message));
    }
  }
}

function getSaga(deps: IDependencies) {
  return function* saga(): SagaIterator {
    const loadDepositAddressActionType: NS.ILoadDepositAddress['type'] = 'BALANCE:LOAD_DEPOSIT_ADDRESS';
    const withdrawCoinsActionType: NS.IWithdrawCoins['type'] = 'BALANCE:WITHDRAW_COINS';
    const withdrawCoinsVerifyActionType: NS.IWithdrawCoinsVerify['type'] = 'BALANCE:WITHDRAW_COINS_VERIFY';
    const saveAddressType: NS.ISaveWithdrawalAddress['type'] = 'BALANCE:SAVE_WITHDRAWAL_ADDRESS';
    const deleteAddressType: NS.IDeleteWithdrawalAddress['type'] = 'BALANCE:DELETE_WITHDRAWAL_ADDRESS';
    yield all([
      takeLatest(loadDepositAddressActionType, executeLoadDepositAddressSaga, deps),
      takeLatest(withdrawCoinsActionType, protect(executeWithdrawCoinsSaga, { conditionalProtection: true }), deps),
      takeLatest(
        withdrawCoinsVerifyActionType,
        protect(executeWithdrawCoinsVerifySaga, { expectsProvider: false }),
        deps,
      ),
      takeLatest(saveAddressType, executeSaveAddressSaga, deps),
      takeLatest(deleteAddressType, executeDeleteAddressSaga, deps),
    ]);
  };
}

export { getSaga };
