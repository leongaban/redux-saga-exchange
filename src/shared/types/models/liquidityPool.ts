export interface ILPAsset {
  symbol: string;
  lastPayout: number;
  historical: number;
}

export interface ILPAssetsResponse {
  poolTotalTio: number;
  lastPayoutTs: string;
  timeValid: boolean;
  assets?: ILPAsset[];
}

export interface ITier {
  rank: string;
  tier: number;
  multiplier: number;
}

export interface ITierGroup {
  rank: number;
  count: string;
  percent: string;
  bold: boolean;
}

export interface ILpApiTotalPayoutRes {
  total_payout: number;
}

export interface IGetTioBalanceData {
  user_id: string;
  tio_locked: number;
}

export interface IGetTioLockedBalanceResponse {
  data: IGetTioBalanceData;
}

export interface IGetLPAssetsData {
  body?: string;
  user_id: string;
  pool_total_tio: number;
  last_payout_timestamp: string;
  time_valid: boolean;
  assets: IServerLPAsset[];
}

export interface IGetLPAssetsResponse {
  data?: IGetLPAssetsData;
}

export interface IServerLPAsset {
  symbol: string;
  last_payout: number;
  historical: number;
}

export interface ILoanAgreementRes {
  document_id: string;
  session_id: string;
}
