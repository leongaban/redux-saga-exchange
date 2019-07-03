import { combineReducers } from 'redux';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';

import { communicationReducer } from './communication';
import { dataReducer } from './data';
import { editReducer } from './edit';
// import { uiReducer } from './ui';

export default combineReducers<NS.IReduxState>({
  communication: communicationReducer,
  data: dataReducer,
  edit: editReducer,
  // ui: uiReducer,
} as ReducersMap<NS.IReduxState>);
