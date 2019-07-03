import { combineReducers, Reducer } from 'redux';
import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';
import { makeResetStateReducer, composeReducers } from 'shared/helpers/redux';

import { initial } from '../data/initial';
import communicationReducer from './communication';
import uiReducer from './ui';
import editReducer from './edit';

const baseReducer = combineReducers<NS.IReduxState>({
    communication: communicationReducer,
    ui: uiReducer,
    edit: editReducer,
  } as ReducersMap<NS.IReduxState>);

const reset = makeResetStateReducer<NS.IReset, NS.IReduxState>('PLACE_ORDER:RESET', initial);

const reducer: Reducer<NS.IReduxState> = composeReducers<NS.IReduxState>([reset, baseReducer]);

export default reducer;
