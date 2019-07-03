interface IBaseWithdrawCoinsRequest {
  transferId: string;
  assetId: string;
  amount: number;
}

export interface IWithdrawToWalletRequest extends IBaseWithdrawCoinsRequest {
  address: string;
  memo?: string;
  paymentSystem?: PaymentSystem;
}

export interface IWithdrawToLPRequest extends IBaseWithdrawCoinsRequest {
  paymentSystem: 'LiquidityPool';
  documentId: string;
}

export interface IWithdrawToForexRequest extends IBaseWithdrawCoinsRequest {
  paymentSystem: '8';
}

export interface IVerifyWithdrawCoinsRequest extends IWithdrawToWalletRequest {
  paymentSystem: PaymentSystem;
}

export type IWithdrawCoinsRequest =
  IWithdrawToWalletRequest | IWithdrawToLPRequest | IWithdrawToForexRequest;

export interface IDepositCoinsRequest {
  assetId: string;
}

// backend enum
export enum PaymentSystem {
  None = 0,
  Bitcoin = 1,
  Litecoin = 2,
  Ethereum = 3,
  BitcoinCash = 4,
  OpenPay = 5,
  Omni = 6,
  LiquidityPool = 7,
  MetaTrader = 8,
  Stellar = 9,
  EOS = 10,
  NEO = 12,
  GAS = 12,
}
