export interface ICreateForexAccountRequest {
  address: string;
  baseAsset: string;
  leverage: number;
  name: string;
}

export interface ICreateForexAccountResponse {
  message: string;
}

export interface IGetForexBalanceData {
  asset: string;
  balance: number;
  credit: number;
  equity: number;
  exchangeRate: number;
  freeMargin: number;
  floating: number;
  leverage: number;
  profit: number;
  margin: number;
  marginLevel: number;
  message: string;
  mt5LoginId: number;
}

export interface IGetForexBalanceResponse {
  asset: string;
  balance: number;
  credit: number;
  equity: number;
  exchange_rate: number;
  free_margin: number;
  floating: number;
  leverage: number;
  profit: number;
  margin: number;
  margin_level: number;
  message: string;
  mt5_login_id: number;
}

export interface IWithdrawForexRequest {
  amount: number;
}

export interface IWithdrawForexResponse {
  message: string;
}
