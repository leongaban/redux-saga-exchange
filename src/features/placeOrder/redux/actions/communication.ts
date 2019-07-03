import { makeCommunicationActionCreators } from 'shared/helpers/redux/index';
import * as NS from '../../namespace';
/* tslint:disable:max-line-length */
export const { execute: placeOrder, completed: placeOrderCompleted, failed: placeOrderFailed } =
  makeCommunicationActionCreators<NS.IPlaceOrder, NS.IPlaceOrderCompleted, NS.IPlaceOrderFailed>(
    'PLACE_ORDER:PLACE_ORDER',
    'PLACE_ORDER:PLACE_ORDER_COMPLETED',
    'PLACE_ORDER:PLACE_ORDER_FAILED',
  );
