import * as namespace from './namespace';
import { actions, selectors, reducer, getSaga } from './redux';
import { IReduxEntry } from 'shared/types/app';
import MiniTickerDataSource from './view/MiniTickerDataSource';

export { namespace, selectors, actions, MiniTickerDataSource };

export const reduxEntry: IReduxEntry = {
  reducers: { miniTickerDataSource: reducer },
  sagas: [getSaga],
};
