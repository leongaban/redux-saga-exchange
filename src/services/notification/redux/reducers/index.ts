import { combineReducers } from 'redux';

import editReducer from './edit';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';

export default combineReducers<NS.IReduxState>({
  edit: editReducer,
} as ReducersMap<NS.IReduxState>);

export { editReducer };
