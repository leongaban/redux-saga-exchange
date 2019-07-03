import { TableColumns } from '../ui';
import { OrderSide } from './common';

export interface ITradeHistoryColumnData {
  exchangeRate: number;
  amount: number;
  date: string;
}

export interface IExtendedTradeHistoryColumnData extends ITradeHistoryColumnData {
  market: string;
  tradeSeq: number;
  comission?: number;
}

export interface ITradeHistoryNonColumnData {
  id: string;
  market: string;
  type: OrderSide;
}

export interface IExtendedTradeHistoryNonColumnData {
  type: OrderSide;
}

export interface ITrade extends ITradeHistoryColumnData, ITradeHistoryNonColumnData { }

export interface IExtendedTrade extends IExtendedTradeHistoryColumnData, IExtendedTradeHistoryNonColumnData { }

export interface IPagedExtendedTrades {
  totalPages: number;
  data: IExtendedTrade[];
}

export type ITradeHistoryColumns = TableColumns<ITradeHistoryColumnData, ITrade>;
export type IExtendedTradeHistoryColumns = TableColumns<IExtendedTradeHistoryColumnData, IExtendedTrade>;

interface IAbstractServerTrade {
  tradeTime: string;
  amount: number;
  executionPrice: number; // this is exchange rate
  instrument: string;
}

export interface ISocketServerTrade extends IAbstractServerTrade {
  tradeId: string;
  side: number; // Buy = 0, Sell = 1
}

// TODO: IName
export interface IEndpointServerTrade extends IAbstractServerTrade {
  tradeSeq: number;
  side: OrderSide;
  comission?: number;
}
