import { combineReducers } from 'redux';
import * as NS from '../../namespace';

import { initial } from '../data/initial';
import { ReducersMap } from 'shared/types/redux';
import makeCommunicationReducer from 'shared/helpers/redux/communication/makeCommunicationReducer';

// tslint:disable:max-line-length
export default combineReducers<NS.IReduxState['communication']>({
  placeOrder: makeCommunicationReducer<NS.IPlaceOrder, NS.IPlaceOrderCompleted, NS.IPlaceOrderFailed>(
    'PLACE_ORDER:PLACE_ORDER',
    'PLACE_ORDER:PLACE_ORDER_COMPLETED',
    'PLACE_ORDER:PLACE_ORDER_FAILED',
    initial.communication.placeOrder,
  ),
} as ReducersMap<NS.IReduxState['communication']>);
