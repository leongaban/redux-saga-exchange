import { IServerUser, IServerOrderInfo } from 'services/api/types';
import { TwoFAType, IServerOrder } from 'shared/types/models';
import { UITheme } from 'shared/types/ui';

export interface IRegisterResponse {
  account: {
    nickname: string;
    email: string;
    id: string;
    affiliateid: string;
  };
}

export interface ILoginResponse {
  message: string;
  secondFactorRequired: boolean;
  provider: TwoFAType;
  account: {
    nickname: string;
    email: string;
    id: string;
    affiliateId: string;
  };
}

export interface IResetPasswordResponse {
  meta: {
    message: string;
  };
}

export interface IChangePasswordResponse {
  meta: {
    message: string;
  };
}

export interface ISetupSecretResponse {
  qrCode: string;
  secret: string;
  authenticityToken: string;
}

export interface IStockExchangeChartResponse {
  data: string;
  ask: string;
  bid: string;
}

export interface IExchangeRatesResponse {
  data: string[][];
}

export interface ISessionRestorationResponse {
  account: IServerUser;
}

export interface IChatMessageResponse {
  id: number;
  userId: string;
  message: string;
  messageTs: number;
  avatarUrl: string;
  nickname: string;
}

export interface ISendChatMessageResponse {
  success: boolean;
  id: number;
}

export interface IPlaceOrdersResponse {
  order: IServerOrderInfo;
}

export interface ILoadSettingsResponse {
  data?: {
    presets?: string;
    favoriteMarkets?: string[];
    theme: UITheme;
    useLiquidityPool: boolean;
    mobileConfig: string;
  };
}

export interface IServerCurrencyBalance {
  asset: string;
  balance: number;
}

export interface ILoadUserBalanceResponse {
  data: IServerCurrencyBalance[];
}

export interface ISecretInfoResponse {
  otpUrl: string;
  secret: string;
  enabled: boolean;
}

export interface ITradeHistoryServerTrade {
  amount: number;
  commission: number;
  executionPrice: number;
  instrument: string;
  side: 0 | 1;
  tradeSeq: number;
  tradeTime: string;
}

interface IFilters {
  market: string;
  side: 0 | 1;
  start_date: string;
  end_date: string;
}

interface IPagination {
  page: number;
  per_page: number;
  total: number;
}
export interface ITradeHistoryServerResponse {
  data: ITradeHistoryServerTrade[];
  filters: IFilters;
  paging: IPagination;
}

interface IPaginationOrderHistory extends IPagination {
  is_hide_canceled: boolean;
}
export interface IOrderHistoryServerResponse {
  filters: IFilters;
  paging: IPaginationOrderHistory;
  data: IServerOrder[];
}

export interface IGetDocumentResponse {
  data: {
    link: string;
  };
}

export interface IGetDocument {
  url: string;
  expiredTime: string;
}

export interface IGetDepositAddressResponse {
  address: string;
  memo?: string;
}

export interface IOpenOrdersResponse {
  data: IServerOrder[];
  paging: IPagination;
}

export interface IGetAnnouncementsResponse {
  data: {
    type: number;
    content: string[];
  };
}

export interface IPostAnnouncementsResponse {
  saved: boolean;
}
