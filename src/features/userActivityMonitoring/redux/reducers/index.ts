import { combineReducers } from 'redux';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';

import { editReducer } from './edit';
import communicationReducer from './communication';
import { uiReducer } from './ui';

export default combineReducers<NS.IReduxState>({
  communication: communicationReducer,
  edit: editReducer,
  ui: uiReducer,
} as ReducersMap<NS.IReduxState>);
