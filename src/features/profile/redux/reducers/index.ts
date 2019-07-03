import { combineReducers } from 'redux';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';

import { communicationReducer } from './communication';
import { uiReducer } from './ui';
import { editReducer } from './edit';

export default combineReducers<NS.IReduxState>({
  communication: communicationReducer,
  ui: uiReducer,
  edit: editReducer,
} as ReducersMap<NS.IReduxState>);
