import { TableColumns } from '../ui';
import { OrderSide, OrderType } from './common';

export enum OrderTypeEnum {
  'Limit',
  'Market',
  'Conditional',
}

export interface IHoldingHideOtherPairs {
  hideOtherPairs: boolean;
}

export type IStatus = 'Working' | 'Rejected' | 'Cancelled' | 'Completed';

export interface IPlaceOrderFormData {
  volume: string;
  price: string;
}

export interface ICopyOrderToWidgetPayload extends
  Partial<Record<OrderSide, Partial<Pick<IPlaceOrderFormData, 'volume' | 'price'>>>> {
  orderSide: OrderSide;
}
export interface ICopyOrderToModalPayload extends Partial<Pick<IPlaceOrderFormData, 'volume' | 'price'>> {
  orderSide: OrderSide;
}

export interface IAbstractOrderColumnData {
  market: string;
  fullVolume: number;
  filledVolume: number;
  filledPercent: number;
  limitPrice: number;
  remainingVolume: number;
  remainingPercent: number;
  orderType: OrderType;
  datePlaced: string;
  type: OrderSide;
}

export interface IAbstractOrderNonColumnData {
  id: number;
  isPending?: boolean;
}

export interface IAbstractOrder extends IAbstractOrderColumnData, IAbstractOrderNonColumnData { }

// tslint:disable-next-line:no-empty-interface
export interface IActiveOrderColumnData extends IAbstractOrderColumnData { }

export interface IArchiveOrderColumnData extends IAbstractOrderColumnData {
  total: number;
  fee: number;
  status: IStatus;
}

export type IActiveOrderNonColumnData = IAbstractOrderNonColumnData;

export type IArchiveOrderNonColumnData = IAbstractOrderNonColumnData;

export interface IActiveOrder extends IAbstractOrder, IActiveOrderColumnData { }

export interface IArchiveOrder extends IAbstractOrder, IArchiveOrderColumnData { }

export interface IPagedArchiveOrders {
  totalPages: number;
  data: IArchiveOrder[];
}

export interface IOrderListVisibleColumns extends Record<keyof IActiveOrderColumnData, boolean> { }
export interface IOrderHistoryVisibleColumns extends Record<keyof IArchiveOrderColumnData, boolean> { }

export type IActiveOrderColumns = TableColumns<IActiveOrderColumnData, IActiveOrder>;

export type IAchiveOrderColumns = TableColumns<IArchiveOrderColumnData, IArchiveOrder>;

export interface IServerOrder {
  orderId: number;
  type: OrderSide;
  baseAmount: number;
  quoteAmount: number;
  requestedAmount: number;
  remainingAmount: number;
  price: number;
  requestedPrice: number;
  loanRate: number;
  rateStop: number;
  instrument: string;
  createdAt: string;
  unitsFilled: number;
  isPending: boolean;
  dateArchived?: string;
  commission: number;
  total: number;
  orderType: number;
  status: IStatus;
  isLimit: boolean;
}

export interface IInOrderDict {
  [market: string]: number;
}
