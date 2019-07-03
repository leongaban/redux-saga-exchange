import { combineReducers } from 'redux';

import { multiReducer } from 'shared/helpers/redux/multiConnect';
import { composeReducers, makeResetStateReducer } from 'shared/helpers/redux';
import { ReducersMap } from 'shared/types/redux';

import initial from '../initial';
import { dataReducer } from './data';
import { uiReducer } from './ui';
import * as NS from '../../namespace';

const baseReducer = combineReducers<NS.IReduxState>({
  data: dataReducer,
  ui: uiReducer,
} as ReducersMap<NS.IReduxState>);

const reset = makeResetStateReducer<NS.IReset, NS.IReduxState>('CHART:RESET', initial);

export default multiReducer<NS.IReduxState>(composeReducers([reset, baseReducer]));
