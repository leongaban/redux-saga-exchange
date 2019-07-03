import { combineReducers } from 'redux';
import * as NS from '../../namespace';

import { initial } from '../data/initial';
import { ReducersMap } from 'shared/types/redux';
import makeCommunicationReducer from 'shared/helpers/redux/communication/makeCommunicationReducer';

// tslint:disable:max-line-length
export default combineReducers<NS.IReduxState['communication']>({

  cancelOrder: makeCommunicationReducer<NS.ICancelOrder, NS.ICancelOrderCompleted, NS.ICancelOrderFailed>(
    'ORDERS:CANCEL_ORDER',
    'ORDERS:CANCEL_ORDER_COMPLETED',
    'ORDERS:CANCEL_ORDER_FAILED',
    initial.communication.cancelOrder,
  ),
  cancelAllOrders: makeCommunicationReducer<NS.ICancelAllOrders, NS.ICancelAllOrdersCompleted, NS.ICancelAllOrdersFailed>(
    'ORDERS:CANCEL_ALL_ORDERS',
    'ORDERS:CANCEL_ALL_ORDERS_COMPLETED',
    'ORDERS:CANCEL_ALL_ORDERS_FAILED',
    initial.communication.cancelOrder,
  ),

} as ReducersMap<NS.IReduxState['communication']>);
