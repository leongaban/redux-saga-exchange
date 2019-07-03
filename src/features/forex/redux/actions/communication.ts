import * as NS from '../../namespace';
import { makeCommunicationActionCreators } from 'shared/helpers/redux';

// tslint:disable:max-line-length
export const { execute: getUseForex, completed: getUseForexSuccess, failed: getUseForexFail } =
  makeCommunicationActionCreators<NS.IGetUseForex, NS.IGetUseForexSuccess, NS.IGetUseForexFail>(
    'FOREX:GET_USE_FOREX', 'FOREX:GET_USE_FOREX_SUCCESS', 'FOREX:GET_USE_FOREX_FAIL',
  );

export const { execute: setUseForex, completed: setUseForexSuccess, failed: setUseForexFail } =
  makeCommunicationActionCreators<NS.ISetUseForex, NS.ISetUseForexSuccess, NS.ISetUseForexFail>(
    'FOREX:SET_USE_FOREX', 'FOREX:SET_USE_FOREX_SUCCESS', 'FOREX:SET_USE_FOREX_FAIL',
  );

export const { execute: getForexBalance, completed: getForexBalanceSuccess, failed: getForexBalanceFail } =
  makeCommunicationActionCreators<NS.IGetForexBalance, NS.IGetForexBalanceSuccess, NS.IGetForexBalanceFail>(
    'FOREX:GET_FOREX_BALANCE', 'FOREX:GET_FOREX_BALANCE_SUCCESS', 'FOREX:GET_FOREX_BALANCE_FAIL',
  );

export const { execute: createForexAccount, completed: createForexAccountSuccess, failed: createForexAccountFail } =
    makeCommunicationActionCreators<NS.ICreateForexAccount, NS.ICreateForexAccountSuccess, NS.ICreateForexAccountFail>(
      'FOREX:CREATE_FOREX_ACCOUNT',
      'FOREX:CREATE_FOREX_ACCOUNT_SUCCESS',
      'FOREX:CREATE_FOREX_ACCOUNT_FAIL',
  );

export const { execute: withdrawFromMT5, completed: withdrawFromMT5Success, failed: withdrawFromMT5Fail } =
  makeCommunicationActionCreators<NS.IWithdrawFromMT5, NS.IWithdrawFromMT5Success, NS.IWithdrawFromMT5Fail>(
    'FOREX:WITHDRAW_FROM_MT5',
    'FOREX:WITHDRAW_FROM_MT5_SUCCESS',
    'FOREX:WITHDRAW_FROM_MT5_FAIL',
);
