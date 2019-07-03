import { combineReducers, Reducer } from 'redux';

import { ReducersMap } from 'shared/types/redux';
import { composeReducers } from 'shared/helpers/redux';

import { IReduxState } from '../../namespace';

import { dataReducer } from './data';
import { communicationReducer } from './communication';

const baseReducer = combineReducers<IReduxState>({
  data: dataReducer,
  communication: communicationReducer,
} as ReducersMap<IReduxState>);

const reducer: Reducer<IReduxState> = composeReducers([baseReducer]);

export default reducer;
