import { combineReducers } from 'redux';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';

import communicationReducer from './communication';
import dataReducer from './data';
import editReducer from './edit';

export default combineReducers<NS.IReduxState>({
  communication: communicationReducer,
  data: dataReducer,
  edit: editReducer,
} as ReducersMap<NS.IReduxState>);
