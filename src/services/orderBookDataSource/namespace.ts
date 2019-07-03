import { IAction, IPlainAction } from 'shared/types/redux';
import { ITradeOrders, IOrderBookInfo } from 'shared/types/models';

export interface IReduxState {
  data: {
    orders: ITradeOrders;
    askTotalAmount: number;
    bidTotalAmount: number;
  };
}

export type IReset = IPlainAction<'ORDER_BOOK_DATA_SOURCE:RESET'>;
export type IApplyOrderBookDiff = IAction<'ORDER_BOOK_DATA_SOURCE:APPLY_ORDER_BOOK_DIFF', IOrderBookInfo>;
export type ISubscribe = IAction<'ORDER_BOOK_DATA_SOURCE:SUBSCRIBE', string>;
export type IUnsubscribe = IAction<'ORDER_BOOK_DATA_SOURCE:UNSUBSCRIBE', string>;

export type Action = IApplyOrderBookDiff | IReset;
