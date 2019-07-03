import { createSelector } from 'reselect';
import { IAppReduxState } from 'shared/types/app';
import { IActiveOrder, IArchiveOrder, IInOrderDict } from 'shared/types/models';

import * as NS from '../../namespace';
import { ICommunication } from 'shared/types/redux';

export function getFeatureState(state: IAppReduxState): NS.IReduxState {
  return state.openOrdersDataSource;
}

export function selectActiveOrders(state: IAppReduxState): IActiveOrder[] {
  return getFeatureState(state).data.active;
}

export function selectArchiveOrders(state: IAppReduxState): IArchiveOrder[] {
  return getFeatureState(state).data.archive;
}

export function selectReportArchiveOrders(state: IAppReduxState): IArchiveOrder[] {
  return getFeatureState(state).data.reportArchive;
}

export function selectReportArchiveOrdersTotalPages(state: IAppReduxState): number {
  return getFeatureState(state).edit.reportArchiveTotalPages;
}

export function selectCommunication(state: IAppReduxState, key: keyof NS.IReduxState['communication']): ICommunication {
  return getFeatureState(state).communication[key];
}

export const selectInOrderValues = createSelector(
  selectActiveOrders,
  (orders) => {
    return orders.reduce((prev, curr) => { // TODO remove split and use quote and base currency
      const [base, quote] = curr.market.split('_');
      const key = curr.type === 'buy' ? quote : base;
      const sum = curr.type === 'buy' ? curr.remainingVolume * curr.limitPrice : curr.remainingVolume;
      return {
        ...prev,
        [key]: prev[key] ? prev[key] + sum : sum,
      };
    }, {} as IInOrderDict);
  },
);

export const selectCurrentMarketActiveOrders = createSelector(
  selectActiveOrders,
  (_: IAppReduxState, market: string) => market,
  (orders, market) => {
    return orders.filter(order => order.market === market);
  },
);
