import { combineReducers } from 'redux';
import { makeCommunicationReducer } from 'shared/helpers/redux';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';

import { initial } from '../initial';

// tslint:disable:max-line-length
export const communicationReducer = combineReducers<NS.IReduxState['communication']>({
  createForexAccount: makeCommunicationReducer<NS.ICreateForexAccount, NS.ICreateForexAccountSuccess, NS.ICreateForexAccountFail>(
    'FOREX:CREATE_FOREX_ACCOUNT',
    'FOREX:CREATE_FOREX_ACCOUNT_SUCCESS',
    'FOREX:CREATE_FOREX_ACCOUNT_FAIL',
    initial.communication.createForexAccount,
  ),
  getForexBalance: makeCommunicationReducer<NS.IGetForexBalance, NS.IGetForexBalanceSuccess, NS.IGetForexBalanceFail>(
    'FOREX:GET_FOREX_BALANCE',
    'FOREX:GET_FOREX_BALANCE_SUCCESS',
    'FOREX:GET_FOREX_BALANCE_FAIL',
    initial.communication.getForexBalance,
  ),
  getUseForex: makeCommunicationReducer<NS.IGetUseForex, NS.IGetUseForexSuccess, NS.IGetUseForexFail>(
    'FOREX:GET_USE_FOREX',
    'FOREX:GET_USE_FOREX_SUCCESS',
    'FOREX:GET_USE_FOREX_FAIL',
    initial.communication.getUseForex,
  ),
  setUseForex: makeCommunicationReducer<NS.ISetUseForex, NS.ISetUseForexSuccess, NS.ISetUseForexFail>(
    'FOREX:SET_USE_FOREX',
    'FOREX:SET_USE_FOREX_SUCCESS',
    'FOREX:SET_USE_FOREX_FAIL',
    initial.communication.setUseForex,
  ),
  withdrawFromMT5: makeCommunicationReducer<NS.IWithdrawFromMT5, NS.IWithdrawFromMT5Success, NS.IWithdrawFromMT5Fail>(
    'FOREX:WITHDRAW_FROM_MT5',
    'FOREX:WITHDRAW_FROM_MT5_SUCCESS',
    'FOREX:WITHDRAW_FROM_MT5_FAIL',
    initial.communication.withdrawFromMT5,
  ),
} as ReducersMap<NS.IReduxState['communication']>);
