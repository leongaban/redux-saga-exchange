import { combineReducers } from 'redux';

import { ReducersMap } from 'shared/types/redux';
import { makeResetStateReducer, composeReducers } from 'shared/helpers/redux';
import * as NS from '../../namespace';
import { initial } from '../initial';

import { communicationReducer } from './communication';
import { uiReducer } from './ui';

export default composeReducers([
  combineReducers<NS.IReduxState>({
    communication: communicationReducer,
    ui: uiReducer,
  } as ReducersMap<NS.IReduxState>),
  makeResetStateReducer<NS.IReset, NS.IReduxState>('WIDGETS:RESET', initial),
]);
