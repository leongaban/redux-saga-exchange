import { combineReducers, Reducer } from 'redux';

import { ReducersMap } from 'shared/types/redux';
import { composeReducers, makeResetStateReducer } from 'shared/helpers/redux';

import * as NS from '../../namespace';
import { initial } from '../initial';

import { communicationReducer } from './communication';
import { dataReducer } from './data';
import { editReducer } from './edit';

const baseReducer = combineReducers<NS.IReduxState>({
  communication: communicationReducer,
  data: dataReducer,
  edit: editReducer,
} as ReducersMap<NS.IReduxState>);

const reset = makeResetStateReducer<NS.IReset, NS.IReduxState>('TRADE_HISTORY:RESET', initial);

const reducer: Reducer<NS.IReduxState> = composeReducers([reset, baseReducer]);

export default reducer;
