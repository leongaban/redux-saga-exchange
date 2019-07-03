import { createSelector } from 'reselect';

import { floorFloat, ceilFloat } from 'shared/helpers/number';
import { IAppReduxState } from 'shared/types/app';
import { IOrderBook, ILastPrice } from 'shared/types/models';
import { selectors as orderBookDSselectors } from 'services/orderBookDataSource';
import { selectors as openOrdersSelectors } from 'services/openOrdersDataSource';

import * as NS from '../../namespace';
import { makeDecimalGrouper } from '../helpers';

export function getFeatureState(state: IAppReduxState): NS.IReduxState {
  return state.orderBook;
}

export function selectDecimals(state: IAppReduxState): number | null {
  return getFeatureState(state).edit.decimals;
}

export const selectOrderBook = createSelector(
  orderBookDSselectors.selectOrders,
  selectDecimals,
  openOrdersSelectors.selectCurrentMarketActiveOrders,
  (orders, selectedDecimals, activeOrders): IOrderBook => {

    const decimals = selectedDecimals === null
      ? 2
      : selectedDecimals;

    const activeAskOrders = activeOrders.filter(x => x.type === 'sell');
    const activeBidOrders = activeOrders.filter(x => x.type === 'buy');

    const displayedOrders: IOrderBook = {
      ask: makeDecimalGrouper(decimals, ceilFloat)(orders.ask, activeAskOrders),
      bid: makeDecimalGrouper(decimals, floorFloat)(orders.bid, activeBidOrders),
    };

    return displayedOrders;
  },
);

export function selectLastPrice(state: IAppReduxState): ILastPrice | null {
  return getFeatureState(state).data.lastPrice;
}
