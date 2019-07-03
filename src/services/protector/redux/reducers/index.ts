import { combineReducers, Reducer } from 'redux';
import { makeResetStateReducer, composeReducers } from 'shared/helpers/redux';

import communicationsReducer from './communications';
import uiReducer from './ui';
import editReducer from './edit';

import initial from '../data/initial';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';

const baseReducer = combineReducers<NS.IReduxState>({
  communications: communicationsReducer,
  ui: uiReducer,
  edit: editReducer,
} as ReducersMap<NS.IReduxState>);

const reset = makeResetStateReducer<NS.IReset, NS.IReduxState>('PROTECTOR:RESET', initial);

const reducer: Reducer<NS.IReduxState> = composeReducers([reset, baseReducer]);

export { communicationsReducer, uiReducer, editReducer };
export default reducer;
