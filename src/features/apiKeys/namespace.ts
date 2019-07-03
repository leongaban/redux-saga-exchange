import { IPlainFailAction, ICommunication, IAction } from 'shared/types/redux';
import { IApiKey } from 'shared/types/models';

export interface IReduxState {
  communication: {
    getApiKeys: ICommunication;
    addApiKey: ICommunication;
    removeApiKey: ICommunication;
  };
  data: {
    apiKeys: IApiKey[];
  };
}

export interface INewApiKeyForm {
  label: string;
  readAccess: boolean;
  trading: boolean;
  withdrawal: boolean;
  ipAddressList: string[];
}

export type IRemoveSecretKey = IAction<'API_KEYS:REMOVE_API_KEY_SECRET_KEY', string>;

export type IGetApiKeys = IPlainFailAction<'API_KEYS:GET_API_KEYS'>;
export type IGetApiKeysSuccess = IAction<'API_KEYS:GET_API_KEYS_SUCCESS', IApiKey[]>;
export type IGetApiKeysFail = IPlainFailAction<'API_KEYS:GET_API_KEYS_FAIL'>;

export type IAddApiKey = IAction<'API_KEYS:ADD_API_KEY', INewApiKeyForm>;
export type IAddApiKeySuccess = IAction<'API_KEYS:ADD_API_KEY_SUCCESS', IApiKey>;
export type IAddApiKeyFail = IPlainFailAction<'API_KEYS:ADD_API_KEY_FAIL'>;

export type IRemoveApiKey = IAction<'API_KEYS:REMOVE_API_KEY', string>;
export type IRemoveApiKeySuccess = IAction<'API_KEYS:REMOVE_API_KEY_SUCCESS', string>;
export type IRemoveApiKeyFail = IPlainFailAction<'API_KEYS:REMOVE_API_KEY_FAIL'>;

export type Action = IGetApiKeys | IGetApiKeysSuccess | IGetApiKeysFail
| IAddApiKey | IAddApiKeySuccess | IAddApiKeyFail
| IRemoveApiKey | IRemoveApiKeySuccess | IRemoveApiKeyFail
| IRemoveSecretKey;
