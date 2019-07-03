import { combineReducers, Reducer } from 'redux';

import { ReducersMap } from 'shared/types/redux';
import { makeResetStateReducer, composeReducers } from 'shared/helpers/redux';

import { initial } from '../data/initial';
import * as NS from '../../namespace';

import communicationReducer from './communication';
import dataReducer from './data';
import editReducer from './edit';
import uiReducer from './ui';

const baseReducer = combineReducers<NS.IReduxState>({
  communication: communicationReducer,
  data: dataReducer,
  edit: editReducer,
  ui: uiReducer,
} as ReducersMap<NS.IReduxState>);

const reset = makeResetStateReducer<NS.IReset, NS.IReduxState>('MARKETS:RESET', initial);

const reducer: Reducer<NS.IReduxState> = composeReducers([reset, baseReducer]);

export default reducer;
