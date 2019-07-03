import { IClosable } from '../ui';

export interface IDepositAddressData {
  address: string;
  memo?: string;
}

export interface IHoldingCurrencyCode {
  currencyCode: string;
}

export type BalanceModalNames = 'depositCoins' | 'withdrawCoins' | 'simplex';

export interface IBalanceModalsState {
  depositCoins: IDepositCoinsModal;
  withdrawCoins: IWithdrawCoinsModal;
  simplex: ISimplexModal;
}

export interface ISimplexModal extends IClosable {
  address: IDepositAddressData | null;
  currency: string | null;
}

export interface IDepositCoinsModal extends IClosable {
  currencyCode: string | null;
  address: IDepositAddressData | null;
}

export interface IWithdrawCoinsModal extends IClosable {
  currencyCode: string | null;
}

export interface ISetBalanceModalPropsPayload<T extends BalanceModalNames> {
  name: T;
  props: Partial<IBalanceModalsState[T]>;
}

export interface IWithdrawCoinsFormData {
  amount: number;
  address: string;
}

export interface ICurrencyBalance {
  code: string;
  value: number;
}

export type UsersBalance = Record<string, ICurrencyBalance[]>;

export interface IWithdrawSettings {
  withdrawFeePercentage: number;
  blockchainCommisionPercentage: number;
  minimumComissionAmount: number;
}

export interface IBalanceDict {
  [code: string]: number;
}

export interface ISavedWithdrawalAddress {
  [label: string]: string;
}

export interface ISavedWithdrawalAddresses {
  [code: string]: ISavedWithdrawalAddress[];
}
