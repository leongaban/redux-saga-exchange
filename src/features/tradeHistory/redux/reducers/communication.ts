import { combineReducers } from 'redux';
import { makeCommunicationReducer } from 'shared/helpers/redux';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';

import { initial } from '../initial';

export const communicationReducer = combineReducers<NS.IReduxState['communication']>({
  load: makeCommunicationReducer<NS.ILoad, NS.ILoadSuccess, NS.ILoadFail>(
    'TRADE_HISTORY:LOAD',
    'TRADE_HISTORY:LOAD_SUCCESS',
    'TRADE_HISTORY:LOAD_FAIL',
    initial.communication.load,
),
} as ReducersMap<NS.IReduxState['communication']>);
