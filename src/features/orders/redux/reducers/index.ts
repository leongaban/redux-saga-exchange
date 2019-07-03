import { combineReducers } from 'redux';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';

import uiReducer from './ui';
import editReducer from './edit';
import communicationReducer from './communication';

export default combineReducers<NS.IReduxState>({
  ui: uiReducer,
  edit: editReducer,
  communication: communicationReducer,
} as ReducersMap<NS.IReduxState>);
