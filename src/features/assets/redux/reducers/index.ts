import { combineReducers } from 'redux';

import { ReducersMap } from 'shared/types/redux';

import { editReducer } from './edit';
import uiReducer from './ui';
import * as NS from '../../namespace';

export default combineReducers<NS.IReduxState>({
  edit: editReducer,
  ui: uiReducer,
} as ReducersMap<NS.IReduxState>);
