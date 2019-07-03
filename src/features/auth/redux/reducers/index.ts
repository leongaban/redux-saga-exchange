import { combineReducers } from 'redux';
import * as NS from '../../namespace';
import dataReducer from './data';
import editReducer from './edit';
import communicationsReducer from './communications';
import { ReducersMap } from 'shared/types/redux';

export default combineReducers<NS.IReduxState>({
    data: dataReducer,
    edit: editReducer,
    communications: communicationsReducer,
} as ReducersMap<NS.IReduxState>);
