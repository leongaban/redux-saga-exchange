import * as NS from '../../namespace';
import { initial } from '../data/initial';

export function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'API_KEYS:GET_API_KEYS_SUCCESS': {
      return {
        ...state,
        apiKeys: action.payload
      };
    }
    case 'API_KEYS:ADD_API_KEY_SUCCESS': {
      return {
        ...state,
        apiKeys: [
          action.payload,
          ...state.apiKeys
        ]
      };
    }
    case 'API_KEYS:REMOVE_API_KEY_SUCCESS': {
      return {
        ...state,
        apiKeys: state.apiKeys.filter(key => key.publicKey !== action.payload)
      };
    }
    case 'API_KEYS:REMOVE_API_KEY_SECRET_KEY': {
      return {
        ...state,
        apiKeys: state.apiKeys.map(key => {
          if (key.publicKey === action.payload) {
            return {
              ...key,
              privateKey: ''
            };
          }
          return key;
        })
      };
    }
    default: return state;
  }
}
