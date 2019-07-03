import * as NS from '../../namespace';
import { combineReducers } from 'redux';
import { ReducersMap } from 'shared/types/redux';
import communicationReducer from './communication';
import dataReducer from './data';
import uiReducer from './ui';

export default combineReducers<NS.IReduxState>({
  communication: communicationReducer,
  data: dataReducer,
  ui: uiReducer,
} as ReducersMap<NS.IReduxState>);
