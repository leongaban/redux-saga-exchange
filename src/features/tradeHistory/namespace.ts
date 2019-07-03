import { ICommunication, IAction, IPlainFailAction, IPlainAction } from 'shared/types/redux';
import { ITrade, ISocketServerTrade, IExtendedTrade, IPagedExtendedTrades } from 'shared/types/models';
import { ILoadFilteredExtendedTradesRequest } from 'shared/types/requests';

export interface IReduxState {
  communication: {
    load: ICommunication,
  };
  data: {
    trades: ITrade[],
    extendedTrades: IExtendedTrade[],
  };
  edit: {
    extendedTradesTotalPages: number;
  };
}

export type ILoad = IAction<'TRADE_HISTORY:LOAD', ILoadFilteredExtendedTradesRequest>;
export type ILoadSuccess = IAction<'TRADE_HISTORY:LOAD_SUCCESS', IPagedExtendedTrades>;
export type ILoadFail = IPlainFailAction<'TRADE_HISTORY:LOAD_FAIL'>;

export type IApplyDiff = IAction<'TRADE_HISTORY:APPLY_DIFF', ISocketServerTrade[]>;

export type ISetExtendedTradesTotalPages = IAction<'TRADE_HISTORY:SET_EXTENDED_TRADES_TOTAL_PAGES', number>;

export type IReset = IPlainAction<'TRADE_HISTORY:RESET'>;

export type Action =
  | ILoad | ILoadSuccess | ILoadFail | IReset | IApplyDiff | ISetExtendedTradesTotalPages;
