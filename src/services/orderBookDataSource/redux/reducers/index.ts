import { combineReducers, Reducer } from 'redux';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';
import { initial } from '../data/initial';

import { dataReducer } from './data';
import { makeResetStateReducer, composeReducers } from 'shared/helpers/redux';

const baseReducer = combineReducers<NS.IReduxState>({
  data: dataReducer,
} as ReducersMap<NS.IReduxState>);

const reset = makeResetStateReducer<NS.IReset, NS.IReduxState>('ORDER_BOOK_DATA_SOURCE:RESET', initial);

const reducer: Reducer<NS.IReduxState> = composeReducers([reset, baseReducer]);

export default reducer;
