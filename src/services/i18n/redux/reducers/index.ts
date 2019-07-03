import { combineReducers, Reducer } from 'redux';

import dataReducer from './data';
import communicationReducer from './communication';

import * as NS from '../../namespace';

const reducer: Reducer<NS.IReduxState> = combineReducers<NS.IReduxState>({
  data: dataReducer,
  communications: communicationReducer,
});

export default reducer;
