import { combineReducers, Reducer } from 'redux';

import { ReducersMap } from 'shared/types/redux';
import { makeResetStateReducer, composeReducers } from 'shared/helpers/redux';
import * as NS from '../../namespace';

import { communicationReducer } from './communication';
import { dataReducer } from './data';
import { initial } from '../data/initial';

const baseReducer = combineReducers<NS.IReduxState>({
  communication: communicationReducer,
  data: dataReducer,
} as ReducersMap<NS.IReduxState>);

const reset = makeResetStateReducer<NS.IReset, NS.IReduxState>('TRANSACTIONS:RESET', initial);

const reducer: Reducer<NS.IReduxState> = composeReducers([reset, baseReducer]);

export default reducer;
