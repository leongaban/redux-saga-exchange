import { ICommunication, IPlainAction, IAction, IPlainFailAction } from 'shared/types/redux';
import { IArchiveOrder, IActiveOrder } from 'shared/types/models';
import { ITablePaginationState } from 'shared/types/ui';

export interface ICancelModalState {
  isOpen: boolean;
  id?: number;
}

export interface IReduxState {
  communication: {
    cancelOrder: ICommunication;
    cancelAllOrders: ICommunication;
  };
  edit: {
    currentOrder: IActiveOrder | IArchiveOrder;
  };
  ui: {
    cancelModalState: ICancelModalState;
    activeOrdersTable: ITablePaginationState;
    orderHistoryTable: ITablePaginationState;
    areCanceledOrdersHidden: boolean;
  };
}

export type ICancelOrder = IAction<'ORDERS:CANCEL_ORDER', number>;
export type ICancelOrderCompleted = IPlainAction<'ORDERS:CANCEL_ORDER_COMPLETED'>;
export type ICancelOrderFailed = IPlainFailAction<'ORDERS:CANCEL_ORDER_FAILED'>;

export type ICancelAllOrders = IPlainAction<'ORDERS:CANCEL_ALL_ORDERS'>;
export type ICancelAllOrdersCompleted = IPlainAction<'ORDERS:CANCEL_ALL_ORDERS_COMPLETED'>;
export type ICancelAllOrdersFailed = IPlainFailAction<'ORDERS:CANCEL_ALL_ORDERS_FAILED'>;

export type ISetIsCancelModalOpen = IAction<'ORDERS:SET_IS_CANCEL_MODAL_OPEN', ICancelModalState>;

export type ISetActiveOrdersTable = IAction<'ORDERS:SET_ACTIVE_ORDERS_TABLE', Partial<ITablePaginationState>>;
export type ISetOrderHistoryTable = IAction<'ORDERS:SET_ORDER_HISTORY_TABLE', Partial<ITablePaginationState>>;

export type ISetCurrentOrder = IAction<'ORDERS:SET_CURRENT_ORDER', IActiveOrder | IArchiveOrder>;

export type ISetAreCanceledOrdersHidden = IAction<'ORDERS:SET_ARE_CANCELED_ORDERS_HIDDEN', boolean>;

export type Action = ISetCurrentOrder | ICancelOrder | ICancelOrderCompleted | ICancelOrderFailed
  | ISetIsCancelModalOpen | ICancelAllOrders | ICancelAllOrdersCompleted | ICancelAllOrdersFailed
  | ISetActiveOrdersTable | ISetOrderHistoryTable | ISetAreCanceledOrdersHidden;
