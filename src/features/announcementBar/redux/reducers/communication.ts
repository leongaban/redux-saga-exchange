import { combineReducers } from 'redux';
import { makeCommunicationReducer } from 'shared/helpers/redux';
import { IReduxState, ILoad, ILoadFail, ILoadSuccess } from '../../namespace';

import { ReducersMap } from 'shared/types/redux';

import { initial } from './initial';

// tslint:disable:max-line-length
export const communicationReducer = combineReducers<IReduxState['communication']>({
  loadingAnnouncements: makeCommunicationReducer<ILoad, ILoadSuccess, ILoadFail>(
    'ANNOUNCEMENT:LOAD',
    'ANNOUNCEMENT:LOAD_SUCCESS',
    'ANNOUNCEMENT:LOAD_FAIL',
    initial.communication.loadingAnnouncements,
  )
} as ReducersMap<IReduxState['communication']>);
