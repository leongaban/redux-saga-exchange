import { combineReducers } from 'redux';

import { ReducersMap } from 'shared/types/redux';

import * as NS from '../../../namespace';
import modalsReducer from './modals';

export const uiReducer = combineReducers<NS.IReduxState['ui']>({
  modals: modalsReducer,
} as ReducersMap<NS.IReduxState['ui']>);
