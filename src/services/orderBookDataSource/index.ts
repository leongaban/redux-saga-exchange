import * as namespace from './namespace';
import { actions, selectors, reducer, getSaga } from './redux';
import { IReduxEntry } from 'shared/types/app';
import OrderBookDataSource from './view/OrderBookDataSource';

export { namespace, selectors, actions, OrderBookDataSource };

export const reduxEntry: IReduxEntry = {
  reducers: { orderBookDataSource: reducer },
  sagas: [getSaga],
};
