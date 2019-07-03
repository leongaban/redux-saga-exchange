import { ITablePaginationState } from 'shared/types/ui';
import * as NS from '../../namespace';

export function setIsCancelModalOpen(payload: NS.ICancelModalState): NS.ISetIsCancelModalOpen {
  return { type: 'ORDERS:SET_IS_CANCEL_MODAL_OPEN', payload };
}

export function setActiveOrdersTable(payload: Partial<ITablePaginationState>): NS.ISetActiveOrdersTable {
  return { type: 'ORDERS:SET_ACTIVE_ORDERS_TABLE', payload };
}

export function setOrderHistoryTable(payload: Partial<ITablePaginationState>): NS.ISetOrderHistoryTable {
  return { type: 'ORDERS:SET_ORDER_HISTORY_TABLE', payload };
}

export function setAreCanceledOrdersHidden(payload: boolean): NS.ISetAreCanceledOrdersHidden {
  return { type: 'ORDERS:SET_ARE_CANCELED_ORDERS_HIDDEN', payload };
}
