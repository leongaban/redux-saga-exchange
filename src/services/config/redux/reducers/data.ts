import * as NS from '../../namespace';
import initial from '../data/initial';
import { getAssetIdFromAssetName } from '../helpers';

function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'CONFIG:LOAD_CURRENCY_PAIRS_SUCCESS': {
      return { ...state, currencyPairs: action.payload };
    }
    case 'CONFIG:LOAD_COUNTRIES_SUCCESS': {
      return { ...state, countries: action.payload };
    }
    case 'CONFIG:LOAD_ASSETS_INFO_SUCCESS': {
      return {
        ...state,
        assetsInfo: {
          ...state.assetsInfo,
          ...action.payload,
        },
      };
    }
    case 'CONFIG:SAVE_ASSET_INFO_SUCCESS': {
      const assetId = getAssetIdFromAssetName(action.payload.assetName, state.assetsInfo);
      return assetId
        ? {
          ...state,
          assetsInfo: {
            ...state.assetsInfo,
            [assetId]: action.payload,
          }
        }
        : state;
    }
    case 'CONFIG:LOAD_USER_CONFIG_SUCCESS': {
      return {
        ...state,
        userConfig: action.payload,
      };
    }
    case 'CONFIG:SET_USER_CONFIG':
    case 'CONFIG:SAVE_USER_CONFIG': {
      if (state.userConfig === null) {
        console.error('userConfig is null when trying to update it with', action.payload);
        return state;
      }
      return {
        ...state,
        userConfig: {
          ...state.userConfig,
          ...action.payload,
        }
      };
    }
    default: {
      return state;
    }
  }
}

export default dataReducer;
