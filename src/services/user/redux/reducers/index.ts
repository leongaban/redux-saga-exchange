import { combineReducers } from 'redux';

import dataReducer from './data';
import communicationsReducer from './communications';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';

export default combineReducers<NS.IReduxState>({
  data: dataReducer,
  communications: communicationsReducer,
} as ReducersMap<NS.IReduxState>);

export { dataReducer, communicationsReducer };
