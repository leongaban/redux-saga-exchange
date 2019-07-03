import { combineReducers } from 'redux';

import dataReducer from './data';
import communicationsReducer from './communication';
import editReducer from './edit';
import uiReducer from './ui';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';

export default combineReducers<NS.IReduxState>({
  data: dataReducer,
  communication: communicationsReducer,
  edit: editReducer,
  ui: uiReducer,
} as ReducersMap<NS.IReduxState>);
export { dataReducer, communicationsReducer };
