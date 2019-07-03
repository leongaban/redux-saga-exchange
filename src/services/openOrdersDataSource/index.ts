import * as namespace from './namespace';
import { actions, selectors, reducer, getSaga } from './redux';
import { IReduxEntry } from 'shared/types/app';
import OpenOrdersDataSource from './view/OpenOrdersDataSource';

export { namespace, selectors, actions, OpenOrdersDataSource };

export const reduxEntry: IReduxEntry = {
  reducers: { openOrdersDataSource: reducer },
  sagas: [getSaga],
};
