import * as NS from '../../namespace';
import { IAppReduxState } from 'shared/types/app';
import { IActiveOrder, IArchiveOrder } from 'shared/types/models';
import { ITablePaginationState } from 'shared/types/ui';

function selectFeatureState(state: IAppReduxState): NS.IReduxState {
  if (!state.orders) {
    throw new Error('Cannot find orders feature state!');
  }

  return state.orders;
}

export function selectIsCancelModalOpen(state: IAppReduxState): boolean {
  return selectFeatureState(state).ui.cancelModalState.isOpen;
}

export function selectModalId(state: IAppReduxState): number | undefined {
  return selectFeatureState(state).ui.cancelModalState.id;
}

export function selectCurrentOrder(state: IAppReduxState): IActiveOrder | IArchiveOrder {
  return selectFeatureState(state).edit.currentOrder;
}

export function selectCancelOrdersIsRequesting(state: IAppReduxState): boolean {
  return selectFeatureState(state).communication.cancelAllOrders.isRequesting;
}

export function selectActiveOrdersTable(state: IAppReduxState): ITablePaginationState {
  return selectFeatureState(state).ui.activeOrdersTable;
}

export function selectOrderHistoryTable(state: IAppReduxState): ITablePaginationState {
  return selectFeatureState(state).ui.orderHistoryTable;
}

export function selectAreCanceledOrdersHidden(state: IAppReduxState): boolean {
  return selectFeatureState(state).ui.areCanceledOrdersHidden;
}
