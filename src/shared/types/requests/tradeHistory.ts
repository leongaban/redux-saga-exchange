import { IExtendedTradeHistoryColumnData } from '../models';
import { ILoadFilteredMarketDataRequest, IMarketDataFilter } from './shared';

export type ITradeHistoryFilter = IMarketDataFilter;

export interface ILoadFilteredExtendedTradesRequest
  extends ILoadFilteredMarketDataRequest<IExtendedTradeHistoryColumnData, ITradeHistoryFilter> { }
