import { makeCommunicationReducer } from 'shared/helpers/redux';
import { ReducersMap } from 'shared/types/redux';
import { combineReducers } from 'redux';

import initial from '../data/initial';

import * as NS from '../../namespace';

// tslint:disable:max-line-length
export default combineReducers<NS.IReduxState['communication']>({
  loadSecuritySettings: makeCommunicationReducer<NS.ILoadSecuritySettings, NS.ILoadSecuritySettingsSuccess, NS.ILoadSecuritySettingsFail>(
    'CONFIG:LOAD_SECURITY_SETTINGS',
    'CONFIG:LOAD_SECURITY_SETTINGS_SUCCESS',
    'CONFIG:LOAD_SECURITY_SETTINGS_FAIL',
    initial.communication.loadSecuritySettings,
  ),
  loadCurrencyPairs: makeCommunicationReducer<NS.ILoadCurrencyPairs, NS.ILoadCurrencyPairsSuccess, NS.ILoadCurrencyPairsFail>(
    'CONFIG:LOAD_CURRENCY_PAIRS',
    'CONFIG:LOAD_CURRENCY_PAIRS_SUCCESS',
    'CONFIG:LOAD_CURRENCY_PAIRS_FAIL',
    initial.communication.loadSecuritySettings,
  ),
  loadCountries: makeCommunicationReducer<NS.ILoadCountries, NS.ILoadCountriesSuccess, NS.ILoadCountriesFail>(
    'CONFIG:LOAD_COUNTRIES',
    'CONFIG:LOAD_COUNTRIES_SUCCESS',
    'CONFIG:LOAD_COUNTRIES_FAIL',
    initial.communication.loadCountries,
  ),
  loadAssetsInfo: makeCommunicationReducer<NS.ILoadAssetsInfo, NS.ILoadAssetsInfoSuccess, NS.ILoadAssetsInfoFail>(
    'CONFIG:LOAD_ASSETS_INFO',
    'CONFIG:LOAD_ASSETS_INFO_SUCCESS',
    'CONFIG:LOAD_ASSETS_INFO_FAIL',
    initial.communication.loadCountries,
  ),
  loadUserConfig: makeCommunicationReducer<NS.ILoadUserConfig, NS.ILoadUserConfigSuccess, NS.ILoadUserConfigFail>(
    'CONFIG:LOAD_USER_CONFIG',
    'CONFIG:LOAD_USER_CONFIG_SUCCESS',
    'CONFIG:LOAD_USER_CONFIG_FAIL',
    initial.communication.loadUserConfig,
  ),
  saveUserConfig: makeCommunicationReducer<NS.ISaveUserConfig, NS.ISaveUserConfigSuccess, NS.ISaveUserConfigFail>(
    'CONFIG:SAVE_USER_CONFIG',
    'CONFIG:SAVE_USER_CONFIG_SUCCESS',
    'CONFIG:SAVE_USER_CONFIG_FAIL',
    initial.communication.saveUserConfig,
  ),
  saveTheme: makeCommunicationReducer<NS.ISaveTheme, NS.ISaveThemeSuccess, NS.ISaveThemeFail>(
    'CONFIG:SAVE_THEME',
    'CONFIG:SAVE_THEME_SUCCESS',
    'CONFIG:SAVE_THEME_FAIL',
    initial.communication.saveTheme,
  ),

  mLoadConfig: makeCommunicationReducer<NS.IMLoadConfig, NS.IMLoadConfigCompleted, NS.IMLoadConfigFail>(
    'CONFIG:M:LOAD_CONFIG',
    'CONFIG:M:LOAD_CONFIG_COMPLETED',
    'CONFIG:M:LOAD_CONFIG_FAIL',
    initial.communication.mLoadConfig,
  ),
} as ReducersMap<NS.IReduxState['communication']>);
