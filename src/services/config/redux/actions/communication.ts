import * as NS from '../../namespace';
import { makeCommunicationActionCreators } from 'shared/helpers/redux';

/* tslint:disable:max-line-length */
export const { execute: loadSecuritySetting, completed: loadSecuritySettingSuccess, failed: loadSecuritySettingFail } =
  makeCommunicationActionCreators<NS.ILoadSecuritySettings, NS.ILoadSecuritySettingsSuccess, NS.ILoadSecuritySettingsFail>(
    'CONFIG:LOAD_SECURITY_SETTINGS', 'CONFIG:LOAD_SECURITY_SETTINGS_SUCCESS', 'CONFIG:LOAD_SECURITY_SETTINGS_FAIL',
  );

export const { execute: loadCurrencyPairs, completed: loadCurrencyPairsSuccess, failed: loadCurrencyPairsFail } =
  makeCommunicationActionCreators<NS.ILoadCurrencyPairs, NS.ILoadCurrencyPairsSuccess, NS.ILoadCurrencyPairsFail>(
    'CONFIG:LOAD_CURRENCY_PAIRS', 'CONFIG:LOAD_CURRENCY_PAIRS_SUCCESS', 'CONFIG:LOAD_CURRENCY_PAIRS_FAIL',
  );

export const { execute: loadCountries, completed: loadCountriesSuccess, failed: loadCountriesFail } =
  makeCommunicationActionCreators<NS.ILoadCountries, NS.ILoadCountriesSuccess, NS.ILoadCountriesFail>(
    'CONFIG:LOAD_COUNTRIES', 'CONFIG:LOAD_COUNTRIES_SUCCESS', 'CONFIG:LOAD_COUNTRIES_FAIL',
  );

export const { execute: loadAssetsInfo, completed: loadAssetsInfoSuccess, failed: loadAssetsInfoFail } =
  makeCommunicationActionCreators<NS.ILoadAssetsInfo, NS.ILoadAssetsInfoSuccess, NS.ILoadAssetsInfoFail>(
    'CONFIG:LOAD_ASSETS_INFO', 'CONFIG:LOAD_ASSETS_INFO_SUCCESS', 'CONFIG:LOAD_ASSETS_INFO_FAIL',
  );

export const { execute: loadUserConfig, completed: loadUserConfigSuccess, failed: loadUserConfigFail } =
  makeCommunicationActionCreators<NS.ILoadUserConfig, NS.ILoadUserConfigSuccess, NS.ILoadUserConfigFail>(
    'CONFIG:LOAD_USER_CONFIG', 'CONFIG:LOAD_USER_CONFIG_SUCCESS', 'CONFIG:LOAD_USER_CONFIG_FAIL',
  );

export const { execute: saveAssetInfo, completed: saveAssetInfoSuccess, failed: saveAssetInfoFail } =
  makeCommunicationActionCreators<NS.ISaveAssetInfo, NS.ISaveAssetInfoSuccess, NS.ISaveAssetInfoFail>(
    'CONFIG:SAVE_ASSET_INFO', 'CONFIG:SAVE_ASSET_INFO_SUCCESS', 'CONFIG:SAVE_ASSET_INFO_FAIL',
  );

export const { execute: saveUserConfig, completed: saveUserConfigSuccess, failed: saveUserConfigFail } =
  makeCommunicationActionCreators<NS.ISaveUserConfig, NS.ISaveUserConfigSuccess, NS.ISaveUserConfigFail>(
    'CONFIG:SAVE_USER_CONFIG', 'CONFIG:SAVE_USER_CONFIG_SUCCESS', 'CONFIG:SAVE_USER_CONFIG_FAIL',
  );

export const { execute: saveTheme, completed: saveThemeSuccess, failed: saveThemeFail } =
  makeCommunicationActionCreators<NS.ISaveTheme, NS.ISaveThemeSuccess, NS.ISaveThemeFail>(
    'CONFIG:SAVE_THEME', 'CONFIG:SAVE_THEME_SUCCESS', 'CONFIG:SAVE_THEME_FAIL',
  );

export const { execute: mLoadConfig, completed: mLoadConfigCompleted, failed: mLoadConfigFail } =
  makeCommunicationActionCreators<NS.IMLoadConfig, NS.IMLoadConfigCompleted, NS.IMLoadConfigFail>(
    'CONFIG:M:LOAD_CONFIG',
    'CONFIG:M:LOAD_CONFIG_COMPLETED',
    'CONFIG:M:LOAD_CONFIG_FAIL',
  );
