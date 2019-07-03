import { IPlaceOrderRequest } from 'shared/types/requests';
import { IOrderHistoryFilter } from 'shared/types/requests/orders';
import { IPlaceOrderServerRequest } from '../types';
import { convertToServerMarketDataFilter } from './shared';

export function convertPlaceOrderRequest(x: IPlaceOrderRequest): IPlaceOrderServerRequest {
  return {
    order: {
      requestedAmount: +x.amount,
      instrument: x.instrument,
      isLimit: x.isLimit,
      loanRate: x.loanRate,
      price: +x.price,
      rateStop: x.rateStop,
      type: x.orderSide,
    },
  };
}

export function convertArchiveOrdersFilters(filters: IOrderHistoryFilter) {
  return {
    ...convertToServerMarketDataFilter(filters),
    IsHideCanceled: filters.hideCancelled,
  };
}
