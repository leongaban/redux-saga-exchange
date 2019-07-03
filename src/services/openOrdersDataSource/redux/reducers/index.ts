import { combineReducers, Reducer } from 'redux';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';
import { initial } from '../data/initial';

import { dataReducer } from './data';
import { editReducer } from './edit';
import communicationReducer from './communication';
import { makeResetStateReducer, composeReducers } from 'shared/helpers/redux';

const baseReducer = combineReducers<NS.IReduxState>({
  communication: communicationReducer,
  data: dataReducer,
  edit: editReducer,
} as ReducersMap<NS.IReduxState>);

const reset = makeResetStateReducer<NS.IReset, NS.IReduxState>('OPEN_ORDERS_DATA_SOURCE:RESET', initial);

const reducer: Reducer<NS.IReduxState> = composeReducers([reset, baseReducer]);

export default reducer;
