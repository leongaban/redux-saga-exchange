import { makeCommunicationActionCreators } from 'shared/helpers/redux/index';
import * as NS from '../../namespace';

/* tslint:disable:max-line-length */

export const { execute: loadArchiveOfOrders, completed: loadArchiveOfOrdersCompleted, failed: loadArchiveOfOrdersFailed } =
  makeCommunicationActionCreators<NS.ILoadArchiveOfOrders, NS.ILoadArchiveOfOrdersCompleted, NS.ILoadArchiveOfOrdersFailed>(
    'OPEN_ORDERS_DATA_SOURCE:LOAD_ARCHIVE_OF_ORDERS',
    'OPEN_ORDERS_DATA_SOURCE:LOAD_ARCHIVE_OF_ORDERS_COMPLETED',
    'OPEN_ORDERS_DATA_SOURCE:LOAD_ARCHIVE_OF_ORDERS_FAILED',
  );

/* tslint:disable:max-line-length */
export const { execute: loadFilteredOrders, completed: loadFilteredOrdersCompleted, failed: loadFilteredOrdersFailed } =
  makeCommunicationActionCreators<NS.ILoadFilteredOrders, NS.ILoadFilteredOrdersCompleted, NS.ILoadFilteredOrdersFailed>(
    'OPEN_ORDERS_DATA_SOURCE:LOAD_FILTERED_ORDERS', 'OPEN_ORDERS_DATA_SOURCE:LOAD_FILTERED_ORDERS_COMPLETED', 'OPEN_ORDERS_DATA_SOURCE:LOAD_FILTERED_ORDERS_FAILED',
  );
