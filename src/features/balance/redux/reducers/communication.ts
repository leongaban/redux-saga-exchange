import { combineReducers } from 'redux';
import { makeCommunicationReducer } from 'shared/helpers/redux';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';

import { initial } from '../initial';

export const communicationReducer = combineReducers<NS.IReduxState['communication']>({

  loadDepositAddress: makeCommunicationReducer<
    NS.ILoadDepositAddress,
    NS.ILoadDepositAddressCompleted,
    NS.ILoadDepositAddressFailed
    >(
      'BALANCE:LOAD_DEPOSIT_ADDRESS',
      'BALANCE:LOAD_DEPOSIT_ADDRESS_COMPLETED',
      'BALANCE:LOAD_DEPOSIT_ADDRESS_FAILED',
      initial.communication.loadDepositAddress,
  ),

  withdrawCoins: makeCommunicationReducer<NS.IWithdrawCoins, NS.IWithdrawCoinsCompleted, NS.IWithdrawCoinsFailed>(
    'BALANCE:WITHDRAW_COINS',
    'BALANCE:WITHDRAW_COINS_COMPLETED',
    'BALANCE:WITHDRAW_COINS_FAILED',
    initial.communication.withdrawCoins,
  ),
  withdrawCoinsVerify:
    makeCommunicationReducer<NS.IWithdrawCoinsVerify, NS.IWithdrawCoinsVerifyCompleted, NS.IWithdrawCoinsVerifyFailed>(
      'BALANCE:WITHDRAW_COINS_VERIFY',
      'BALANCE:WITHDRAW_COINS_VERIFY_COMPLETED',
      'BALANCE:WITHDRAW_COINS_VERIFY_FAILED',
      initial.communication.withdrawCoinsVerify,
    ),

} as ReducersMap<NS.IReduxState['communication']>);
