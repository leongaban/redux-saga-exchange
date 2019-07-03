import * as NS from '../../namespace';
import { makeCommunicationActionCreators } from 'shared/helpers/redux';

export const { execute: getApiKeys, completed: getApiKeysSuccess, failed: getApiKeysFail } =
  makeCommunicationActionCreators<NS.IGetApiKeys, NS.IGetApiKeysSuccess, NS.IGetApiKeysFail>(
    'API_KEYS:GET_API_KEYS', 'API_KEYS:GET_API_KEYS_SUCCESS', 'API_KEYS:GET_API_KEYS_FAIL',
  );

export const { execute: addApiKey, completed: addApiKeySuccess, failed: addApiKeyFail } =
  makeCommunicationActionCreators<NS.IAddApiKey, NS.IAddApiKeySuccess, NS.IAddApiKeyFail>(
    'API_KEYS:ADD_API_KEY', 'API_KEYS:ADD_API_KEY_SUCCESS', 'API_KEYS:ADD_API_KEY_FAIL',
  );

export const { execute: removeApiKey, completed: removeApiKeySuccess, failed: removeApiKeyFail } =
  makeCommunicationActionCreators<NS.IRemoveApiKey, NS.IRemoveApiKeySuccess, NS.IRemoveApiKeyFail>(
    'API_KEYS:REMOVE_API_KEY', 'API_KEYS:REMOVE_API_KEY_SUCCESS', 'API_KEYS:REMOVE_API_KEY_FAIL',
  );
