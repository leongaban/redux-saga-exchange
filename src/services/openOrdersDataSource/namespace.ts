import { IAction, IPlainAction, IPlainFailAction, ICommunication } from 'shared/types/redux';
import { IActiveOrder, IArchiveOrder, IPagedArchiveOrders } from 'shared/types/models';
import { ILoadFilteredArchiveOrdersRequest } from 'shared/types/requests/orders';

export interface IReduxState {
  communication: {
    loadFilteredOrders: ICommunication;
  };
  data: {
    active: IActiveOrder[];
    archive: IArchiveOrder[];
    reportArchive: IArchiveOrder[];
  };
  edit: {
    reportArchiveTotalPages: number;
  };
}

export type ILoadArchiveOfOrders = IPlainAction<'OPEN_ORDERS_DATA_SOURCE:LOAD_ARCHIVE_OF_ORDERS'>;
export type ILoadArchiveOfOrdersCompleted = IAction<'OPEN_ORDERS_DATA_SOURCE:LOAD_ARCHIVE_OF_ORDERS_COMPLETED',
  IArchiveOrder[]>;
export type ILoadArchiveOfOrdersFailed = IPlainFailAction<'OPEN_ORDERS_DATA_SOURCE:LOAD_ARCHIVE_OF_ORDERS_FAILED'>;

export type ILoadFilteredOrders = IAction<
  'OPEN_ORDERS_DATA_SOURCE:LOAD_FILTERED_ORDERS',
  ILoadFilteredArchiveOrdersRequest
  >;

export type ILoadFilteredOrdersCompleted = IAction<
  'OPEN_ORDERS_DATA_SOURCE:LOAD_FILTERED_ORDERS_COMPLETED',
  IPagedArchiveOrders
  >;
export type ILoadFilteredOrdersFailed = IPlainFailAction<'OPEN_ORDERS_DATA_SOURCE:LOAD_FILTERED_ORDERS_FAILED'>;

export type ISetReportArchiveTotalPages = IAction<'OPEN_ORDERS_DATA_SOURCE:SET_REPORT_ARCHIVE_TOTAL_PAGES', number>;

export type IReset = IPlainAction<'OPEN_ORDERS_DATA_SOURCE:RESET'>;

export type IApplyActiveOrdersDiff = IAction<'OPEN_ORDERS_DATA_SOURCE:APPLY_ACTIVE_ORDERS_DIFF', IActiveOrder[]>;
export type IApplyArchiveOrdersDiff = IAction<'OPEN_ORDERS_DATA_SOURCE:APPLY_ARCHIVE_ORDERS_DIFF', IArchiveOrder[]>;

export type ISubscribe = IAction<'OPEN_ORDERS_DATA_SOURCE:SUBSCRIBE', string>;
export type IUnsubscribe = IAction<'OPEN_ORDERS_DATA_SOURCE:UNSUBSCRIBE', string>;

export type Action = IApplyActiveOrdersDiff | IApplyArchiveOrdersDiff | IReset
  | ILoadArchiveOfOrders | ILoadArchiveOfOrdersCompleted | ILoadArchiveOfOrdersFailed
  | ILoadFilteredOrders | ILoadFilteredOrdersCompleted | ILoadFilteredOrdersFailed
  | ISetReportArchiveTotalPages;
