import { makeCommunicationActionCreators } from 'shared/helpers/redux';
import * as NS from '../../namespace';

// tslint:disable:max-line-length

export const { execute: loadDepositAddress, completed: loadDepositAddressCompleted, failed: loadDepositAddressFailed } =
  makeCommunicationActionCreators<NS.ILoadDepositAddress, NS.ILoadDepositAddressCompleted, NS.ILoadDepositAddressFailed>(
    'BALANCE:LOAD_DEPOSIT_ADDRESS', 'BALANCE:LOAD_DEPOSIT_ADDRESS_COMPLETED', 'BALANCE:LOAD_DEPOSIT_ADDRESS_FAILED',
  );

export const { execute: withdrawCoins, completed: withdrawCoinsCompleted, failed: withdrawCoinsFailed } =
  makeCommunicationActionCreators<NS.IWithdrawCoins, NS.IWithdrawCoinsCompleted, NS.IWithdrawCoinsFailed>(
    'BALANCE:WITHDRAW_COINS', 'BALANCE:WITHDRAW_COINS_COMPLETED', 'BALANCE:WITHDRAW_COINS_FAILED',
  );

export const { execute: withdrawCoinsVerify, completed: withdrawCoinsVerifyCompleted, failed: withdrawCoinsVerifyFailed } =
  makeCommunicationActionCreators<NS.IWithdrawCoinsVerify, NS.IWithdrawCoinsVerifyCompleted, NS.IWithdrawCoinsVerifyFailed>(
    'BALANCE:WITHDRAW_COINS_VERIFY', 'BALANCE:WITHDRAW_COINS_VERIFY_COMPLETED', 'BALANCE:WITHDRAW_COINS_VERIFY_FAILED',
  );

export const { execute: saveWithdrawalAddress, completed: saveWithdrawalAddressCompleted, failed: saveWithdrawalAddressFailed } =
  makeCommunicationActionCreators<NS.ISaveWithdrawalAddress, NS.ISaveWithdrawalAddressCompleted, NS.ISaveWithdrawalAddressFailed>(
    'BALANCE:SAVE_WITHDRAWAL_ADDRESS', 'BALANCE:SAVE_WITHDRAWAL_ADDRESS_COMPLETED', 'BALANCE:SAVE_WITHDRAWAL_ADDRESS_FAILED',
  );

export const { execute: deleteWithdrawalAddress, completed: deleteWithdrawalAddressCompleted, failed: deleteWithdrawalAddressFailed } =
  makeCommunicationActionCreators<NS.IDeleteWithdrawalAddress, NS.IDeleteWithdrawalAddressCompleted, NS.IDeleteWithdrawalAddressFailed>(
    'BALANCE:DELETE_WITHDRAWAL_ADDRESS', 'BALANCE:DELETE_WITHDRAWAL_ADDRESS_COMPLETED', 'BALANCE:DELETE_WITHDRAWAL_ADDRESS_FAILED',
  );
