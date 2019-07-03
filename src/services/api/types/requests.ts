export interface IWalletAddressRequest {
  assetId: string;
}

export interface IRegisterRequest {
  account: {
    nickname: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  };
}

export interface IChangePasswordRequest {
  account: {
    password: string;
  };
  resetPasswordToken?: string;
}

export interface IPlaceOrderServerRequestOrder {
  type: 'buy' | 'sell';
  requestedAmount: number;
  price: number;
  isLimit: boolean;
  loanRate: number;
  rateStop: number;
  instrument: string;
}

export interface IPlaceOrderServerRequest {
  order: IPlaceOrderServerRequestOrder;
}

export interface IMarketDataFilterRequest {
  Market?: string;
  Asset?: string;
  Side?: number;
  StartDate?: string;
  EndDate?: string;
}

export interface IServerLoadUsersRequest {
  Page: number;
  PerPage: number;
  Type: 'all' | 'verified' | 'unverified' | 'admins';
  Search?: string;
}

export interface IEditMarketRequest {
  BaseFee?: number;
  QuoteFee?: number;
  MakerFee?: number;
  TakerFee?: number;
  PriceScale?: number;
  AmountScale?: number;
  MinOrderValue?: number;
  MinTradeAmount?: number;
  Hidden?: boolean;
}

export interface I2FASetupRequest {
  new2FaProviderCode: string;
  code?: string;
}

export interface IGetUsersTotalPayoutRequest {
  userId: string;
}
