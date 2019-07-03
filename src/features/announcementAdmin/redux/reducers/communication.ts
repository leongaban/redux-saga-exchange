import { combineReducers } from 'redux';
import { makeCommunicationReducer } from 'shared/helpers/redux';
import * as NS from '../../namespace';

import { ReducersMap } from 'shared/types/redux';

import { initial } from './initial';

export const communicationReducer = combineReducers<NS.IReduxState['communication']>({
  loadingAnnouncements: makeCommunicationReducer<NS.ILoad, NS.ILoadSuccess, NS.ILoadFail>(
    'ANNOUNCEMENT_ADMIN:LOAD',
    'ANNOUNCEMENT_ADMIN:LOAD_SUCCESS',
    'ANNOUNCEMENT_ADMIN:LOAD_FAIL',
    initial.communication.loadingAnnouncements,
  ),
  savingAnnouncements: makeCommunicationReducer<NS.ISave, NS.ISaveSuccess, NS.ISaveFail>(
    'ANNOUNCEMENT_ADMIN:SAVE',
    'ANNOUNCEMENT_ADMIN:SAVE_SUCCESS',
    'ANNOUNCEMENT_ADMIN:SAVE_FAIL',
    initial.communication.savingAnnouncements,
  )
} as ReducersMap<NS.IReduxState['communication']>);
