import { createSelector } from 'reselect';

import { IAppReduxState } from 'shared/types/app';
import { ITradeOrders } from 'shared/types/models';

import * as NS from '../../namespace';

export function getFeatureState(state: IAppReduxState): NS.IReduxState {
  return state.orderBookDataSource;
}

export function selectOrders(state: IAppReduxState): ITradeOrders {
  return getFeatureState(state).data.orders;
}

export function selectAskTotalAmount(state: IAppReduxState): number {
  return getFeatureState(state).data.askTotalAmount;
}

export function selectBidTotalAmount(state: IAppReduxState): number {
  return getFeatureState(state).data.bidTotalAmount;
}

export const selectMaxBidPrice = createSelector(
  selectOrders,
  (orders): number => {
    const order = orders.bid[0];
    return order ? order.price : 0;
  },
);

export const selectMinAskPrice = createSelector(
  selectOrders,
  (orders): number => {
    const order = orders.ask[0];
    return order ? order.price : 0;
  },
);
