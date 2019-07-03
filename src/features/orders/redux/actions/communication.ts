import { makeCommunicationActionCreators } from 'shared/helpers/redux/index';
import * as NS from '../../namespace';

export const { execute: cancelOrder, completed: cancelOrderCompleted, failed: cancelOrderFailed } =
  makeCommunicationActionCreators<NS.ICancelOrder, NS.ICancelOrderCompleted, NS.ICancelOrderFailed>(
    'ORDERS:CANCEL_ORDER',
    'ORDERS:CANCEL_ORDER_COMPLETED',
    'ORDERS:CANCEL_ORDER_FAILED',
  );

export const { execute: cancelAllOrders, completed: cancelAllOrdersCompleted, failed: cancelAllOrdersFailed } =
  makeCommunicationActionCreators<NS.ICancelAllOrders, NS.ICancelAllOrdersCompleted, NS.ICancelAllOrdersFailed>(
    'ORDERS:CANCEL_ALL_ORDERS',
    'ORDERS:CANCEL_ALL_ORDERS_COMPLETED',
    'ORDERS:CANCEL_ALL_ORDERS_FAILED',
  );
