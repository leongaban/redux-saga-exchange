import { combineReducers } from 'redux';
import { makeCommunicationReducer } from 'shared/helpers/redux';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';

import { initial } from '../data/initial';

// tslint:disable:max-line-length
export const communicationReducer = combineReducers<NS.IReduxState['communication']>({
  getApiKeys: makeCommunicationReducer<NS.IGetApiKeys, NS.IGetApiKeysSuccess, NS.IGetApiKeysFail>(
    'API_KEYS:GET_API_KEYS',
    'API_KEYS:GET_API_KEYS_SUCCESS',
    'API_KEYS:GET_API_KEYS_FAIL',
    initial.communication.getApiKeys,
  ),
  addApiKey: makeCommunicationReducer<NS.IAddApiKey, NS.IAddApiKeySuccess, NS.IAddApiKeyFail>(
    'API_KEYS:ADD_API_KEY',
    'API_KEYS:ADD_API_KEY_SUCCESS',
    'API_KEYS:ADD_API_KEY_FAIL',
    initial.communication.addApiKey,
  ),
  removeApiKey: makeCommunicationReducer<NS.IRemoveApiKey, NS.IRemoveApiKeySuccess, NS.IRemoveApiKeyFail>(
    'API_KEYS:REMOVE_API_KEY',
    'API_KEYS:REMOVE_API_KEY_SUCCESS',
    'API_KEYS:REMOVE_API_KEY_FAIL',
    initial.communication.removeApiKey,
  )
} as ReducersMap<NS.IReduxState['communication']>);
