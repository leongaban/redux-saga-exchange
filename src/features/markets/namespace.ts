import { ICommunication, IPlainAction, IAction, IPlainFailAction } from 'shared/types/redux';
import { IMarket, IEditMarketInfo } from 'shared/types/models';

export interface IReduxState {
  communication: {
    load: ICommunication;
    updateMarket: ICommunication;
  };
  data: {
    markets: IMarket[],
  };
  edit: {
    currentMarket: IMarket | null;
  };
  ui: {
    isEditMarketModalShown: boolean;
  };
}

export interface IEditMarketForm {
  id: string;
  makerFee: string;
  takerFee: string;
  baseFee: string;
  quoteFee: string;
  priceScale: string;
  amountScale: string;
  hidden: boolean;
  minOrderValue: string;
  minTradeAmount: string;
}

export type ILoad = IPlainAction<'MARKETS:LOAD'>;
export type ILoadCompleted = IAction<'MARKETS:LOAD_COMPLETED', IMarket[]>;
export type ILoadFailed = IPlainFailAction<'MARKETS:LOAD_FAILED'>;

export type IEditMarket = IAction<'MARKETS:EDIT_MARKET', IEditMarketInfo>;
export type IEditMarketCompleted = IAction<'MARKETS:EDIT_MARKET_COMPLETED', IMarket[]>;
export type IEditMarketFailed = IPlainFailAction<'MARKETS:EDIT_MARKET_FAILED'>;

export type ISetEditMarketModalState = IAction<'MARKETS:SET_EDIT_MARKET_MODAL_STATE', boolean>;
export type ISetCurrentMarket = IAction<'MARKETS:SET_CURRENT_MARKET', IMarket | null>;

export type IReset = IPlainAction<'MARKETS:RESET'>;

export type Action =
  ILoad |
  ILoadCompleted |
  ILoadFailed |
  IEditMarket |
  IEditMarketCompleted |
  IEditMarketFailed |
  ISetEditMarketModalState |
  ISetCurrentMarket;
