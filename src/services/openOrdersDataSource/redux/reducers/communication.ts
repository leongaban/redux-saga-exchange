import { combineReducers } from 'redux';
import * as NS from '../../namespace';

import { initial } from '../data/initial';
import { ReducersMap } from 'shared/types/redux';
import makeCommunicationReducer from 'shared/helpers/redux/communication/makeCommunicationReducer';

// tslint:disable:max-line-length
export default combineReducers<NS.IReduxState['communication']>({
  loadFilteredOrders: makeCommunicationReducer<NS.ILoadFilteredOrders, NS.ILoadFilteredOrdersCompleted, NS.ILoadFilteredOrdersFailed>(
    'OPEN_ORDERS_DATA_SOURCE:LOAD_FILTERED_ORDERS',
    'OPEN_ORDERS_DATA_SOURCE:LOAD_FILTERED_ORDERS_COMPLETED',
    'OPEN_ORDERS_DATA_SOURCE:LOAD_FILTERED_ORDERS_FAILED',
    initial.communication.loadFilteredOrders,
  ),

} as ReducersMap<NS.IReduxState['communication']>);
