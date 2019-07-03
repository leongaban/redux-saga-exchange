import { IArchiveOrderColumnData, IPagedRequest, ISortRequest, IFilteredRequest } from '../models';
import { IMarketDataFilter } from './shared';

export interface IOrderHistoryFilter extends IMarketDataFilter {
  hideCancelled?: boolean;
}

interface ILoadArchiveOrdersRequest extends
  IPagedRequest,
  ISortRequest<Partial<IArchiveOrderColumnData>>,
  IFilteredRequest<IOrderHistoryFilter> { }

export type ILoadFilteredArchiveOrdersRequest = ILoadArchiveOrdersRequest;
export interface ILoadUserArchiveOrdersRequest extends ILoadArchiveOrdersRequest {
  userID: string;
}

export interface ILoadUserOpenOrdersRequest extends IPagedRequest {
  userID: string;
}
