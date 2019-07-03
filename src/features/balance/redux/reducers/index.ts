import { combineReducers, Reducer } from 'redux';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';
import { initial } from '../initial';

import { communicationReducer } from './communication';
import { uiReducer } from './ui';
import { makeResetStateReducer, composeReducers } from 'shared/helpers/redux';

const baseReducer = combineReducers<NS.IReduxState>({
  communication: communicationReducer,
  ui: uiReducer,
} as ReducersMap<NS.IReduxState>);

const reset = makeResetStateReducer<NS.IReset, NS.IReduxState>('BALANCE:RESET', initial);

const reducer: Reducer<NS.IReduxState> = composeReducers([reset, baseReducer]);

export default reducer;
