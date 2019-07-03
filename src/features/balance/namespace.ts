import { ICommunication, IAction, IPlainAction, IPlainFailAction } from 'shared/types/redux';

import {
  IHoldingCurrencyCode, IBalanceModalsState, ISetBalanceModalPropsPayload,
  ISavedWithdrawalAddress,
  ISavedWithdrawalAddresses,
  IDepositAddressData
} from 'shared/types/models';
import { IWithdrawCoinsRequest, IVerifyWithdrawCoinsRequest } from 'shared/types/requests';

export interface IReduxState {
  communication: {
    loadDepositAddress: ICommunication;
    withdrawCoins: ICommunication;
    withdrawCoinsVerify: ICommunication;
  };
  ui: {
    modals: IBalanceModalsState; // TODO think about it. It's not a model
  };
}

export type ILoadDepositAddressPayload = IHoldingCurrencyCode;
export type ILoadWithdrawSettingsPayload = IHoldingCurrencyCode;

export interface ISaveOrDeleteWithdrawalAddressPayload {
  address: ISavedWithdrawalAddress;
  currencyCode: string;
}

export interface IWithdrawCoinsFormData {
  amount: string;
  address: string | ISavedWithdrawalAddress;
  memo: string;
  newAddressLabel: string;
  newAddress: string;
}

/*tslint:disable:max-line-length*/

export type ISetModalProps<T extends keyof IReduxState['ui']['modals']>
  = IAction<'BALANCE:SET_MODAL_PROPS', ISetBalanceModalPropsPayload<T>>;

export type ILoadDepositAddress = IAction<'BALANCE:LOAD_DEPOSIT_ADDRESS', ILoadDepositAddressPayload>;
export type ILoadDepositAddressCompleted = IAction<'BALANCE:LOAD_DEPOSIT_ADDRESS_COMPLETED', IDepositAddressData>;
export type ILoadDepositAddressFailed = IPlainFailAction<'BALANCE:LOAD_DEPOSIT_ADDRESS_FAILED'>;

export type IWithdrawCoins = IAction<'BALANCE:WITHDRAW_COINS', IWithdrawCoinsRequest>;
export type IWithdrawCoinsCompleted = IPlainAction<'BALANCE:WITHDRAW_COINS_COMPLETED'>;
export type IWithdrawCoinsFailed = IPlainFailAction<'BALANCE:WITHDRAW_COINS_FAILED'>;

export type IWithdrawCoinsVerify = IAction<'BALANCE:WITHDRAW_COINS_VERIFY', IVerifyWithdrawCoinsRequest>;
export type IWithdrawCoinsVerifyCompleted = IPlainAction<'BALANCE:WITHDRAW_COINS_VERIFY_COMPLETED'>;
export type IWithdrawCoinsVerifyFailed = IPlainFailAction<'BALANCE:WITHDRAW_COINS_VERIFY_FAILED'>;

export type ISaveWithdrawalAddress = IAction<'BALANCE:SAVE_WITHDRAWAL_ADDRESS', ISaveOrDeleteWithdrawalAddressPayload>;
export type ISaveWithdrawalAddressCompleted =
  IAction<'BALANCE:SAVE_WITHDRAWAL_ADDRESS_COMPLETED', ISaveOrDeleteWithdrawalAddressPayload>;
export type ISaveWithdrawalAddressFailed = IPlainFailAction<'BALANCE:SAVE_WITHDRAWAL_ADDRESS_FAILED'>;

export type IDeleteWithdrawalAddress = IAction<'BALANCE:DELETE_WITHDRAWAL_ADDRESS', ISaveOrDeleteWithdrawalAddressPayload>;
export type IDeleteWithdrawalAddressCompleted =
  IAction<'BALANCE:DELETE_WITHDRAWAL_ADDRESS_COMPLETED', ISavedWithdrawalAddresses>;
export type IDeleteWithdrawalAddressFailed = IPlainFailAction<'BALANCE:DELETE_WITHDRAWAL_ADDRESS_FAILED'>;

export type IReset = IPlainAction<'BALANCE:RESET'>;

export type Action =
  | ILoadDepositAddress | ILoadDepositAddressCompleted | ILoadDepositAddressFailed
  | IWithdrawCoins | IWithdrawCoinsCompleted | IWithdrawCoinsFailed
  | IWithdrawCoinsVerify | IWithdrawCoinsVerifyCompleted | IWithdrawCoinsVerifyFailed
  | IReset | ISetModalProps<keyof IReduxState['ui']['modals']> | ISaveWithdrawalAddress | ISaveWithdrawalAddressCompleted | ISaveWithdrawalAddressFailed | IDeleteWithdrawalAddress | IDeleteWithdrawalAddressCompleted | IDeleteWithdrawalAddressFailed;
