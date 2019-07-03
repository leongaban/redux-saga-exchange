import { IPlainAction, ICommunication, IAction, IPlainFailAction } from 'shared/types/redux';
import {
  ICurrencyPair, ICountry, IAssetsInfoMap, IPresetLayouts, IAssetInfo, IUserConfig,
  IMConfig,
} from 'shared/types/models';
import { ClientDeviceType, UITheme } from 'shared/types/ui';
import { IOrderHistoryFilter } from 'shared/types/requests';

export interface IReduxState {
  communication: {
    loadSecuritySettings: ICommunication,
    loadCurrencyPairs: ICommunication,
    loadCountries: ICommunication,
    loadAssetsInfo: ICommunication,
    loadUserConfig: ICommunication,
    saveUserConfig: ICommunication;
    mLoadConfig: ICommunication;
    saveTheme: ICommunication;
  };
  data: {
    securitySettings: ISecuritySettings,
    protectActions: IProtectAction[],
    countries: ICountry[];
    currencyPairs: ICurrencyPair[];
    assetsInfo: IAssetsInfoMap;
    userAgent: IUAParser.IResult;
    userConfig: IUserConfig | null;
  };
  edit: {
    currentPresetsLayouts: IPresetLayouts[];
    presetsHaveUnsavedChanges: boolean;
    mobile: {
      currentCurrencyPairID: string | null;
    };
  };
  ui: {
    clientDeviceType: ClientDeviceType;
    theme: UITheme;
  };
}

export interface ISecuritySettings {
  loginTriesBeforeCaptcha: number;
  loginTriesBeforeLock: number;
  loginRetryPeriod: number;
  restorePassTriesBeforeLock: number;
  restorePassRetryPeriod: number;
}

export interface ICountry {
  id: number;
  name: string;
}

export type ProtectActionKeys = 'login' | 'restorePassword' | 'changeEmail' | 'editProfile' | 'manageSecurity'
  | 'placeOrder' | 'cancelOrder' | 'postingComment' | 'postingArticle';

export interface IProtectAction {
  id: ProtectActionKeys;
  name: string;
}

export type IFilterForm = Required<IOrderHistoryFilter>;

export interface ISavePresetsOptions {
  isSavedWithNewLayouts: boolean;
}

export type ISetCurrentPresetsLayouts = IAction<'CONFIG:SET_CURRENT_PRESETS_LAYOUTS', IPresetLayouts[]>;
export type ISetPresetsHaveUnsavedChanges = IAction<'CONFIG:SET_PRESETS_HAVE_UNSAVED_CHANGES', boolean>;
export type ISaveCurrentPresetsLayouts = IPlainAction<'CONFIG:SAVE_CURRENT_PRESETS_LAYOUTS'>;

export type ILoadSecuritySettings = IPlainAction<'CONFIG:LOAD_SECURITY_SETTINGS'>;
export type ILoadSecuritySettingsSuccess = IAction<'CONFIG:LOAD_SECURITY_SETTINGS_SUCCESS', ISecuritySettings>;
export type ILoadSecuritySettingsFail = IPlainFailAction<'CONFIG:LOAD_SECURITY_SETTINGS_FAIL'>;

export type ILoadCurrencyPairs = IPlainAction<'CONFIG:LOAD_CURRENCY_PAIRS'>;
export type ILoadCurrencyPairsSuccess = IAction<'CONFIG:LOAD_CURRENCY_PAIRS_SUCCESS', ICurrencyPair[]>;
export type ILoadCurrencyPairsFail = IPlainFailAction<'CONFIG:LOAD_CURRENCY_PAIRS_FAIL'>;

export type ILoadCountries = IAction<'CONFIG:LOAD_COUNTRIES', string>;
export type ILoadCountriesSuccess = IAction<'CONFIG:LOAD_COUNTRIES_SUCCESS', ICountry[]>;
export type ILoadCountriesFail = IPlainFailAction<'CONFIG:LOAD_COUNTRIES_FAIL'>;

export type ISaveAssetInfo = IAction<'CONFIG:SAVE_ASSET_INFO', IAssetInfo>;
export type ISaveAssetInfoSuccess = IAction<'CONFIG:SAVE_ASSET_INFO_SUCCESS', IAssetInfo>;
export type ISaveAssetInfoFail = IPlainFailAction<'CONFIG:SAVE_ASSET_INFO_FAIL'>;

export type ILoadAssetsInfo = IPlainAction<'CONFIG:LOAD_ASSETS_INFO'>;
export type ILoadAssetsInfoSuccess = IAction<'CONFIG:LOAD_ASSETS_INFO_SUCCESS', IAssetsInfoMap>;
export type ILoadAssetsInfoFail = IPlainFailAction<'CONFIG:LOAD_ASSETS_INFO_FAIL'>;

export type ILoadUserConfig = IPlainAction<'CONFIG:LOAD_USER_CONFIG'>;
export type ILoadUserConfigSuccess = IAction<'CONFIG:LOAD_USER_CONFIG_SUCCESS', IUserConfig>;
export type ILoadUserConfigFail = IPlainFailAction<'CONFIG:LOAD_USER_CONFIG_FAIL'>;

export type ISetUserConfig = IAction<'CONFIG:SET_USER_CONFIG', Partial<IUserConfig>>;

export type ISaveUserConfig = IAction<'CONFIG:SAVE_USER_CONFIG', Partial<IUserConfig>>;
export type ISaveUserConfigSuccess = IPlainAction<'CONFIG:SAVE_USER_CONFIG_SUCCESS'>;
export type ISaveUserConfigFail = IPlainFailAction<'CONFIG:SAVE_USER_CONFIG_FAIL'>;

export type ISetTheme = IAction<'CONFIG:SET_THEME', UITheme>;

export type ISaveTheme = IAction<'CONFIG:SAVE_THEME', UITheme>;
export type ISaveThemeSuccess = IPlainFailAction<'CONFIG:SAVE_THEME_SUCCESS'>;
export type ISaveThemeFail = IPlainFailAction<'CONFIG:SAVE_THEME_FAIL'>;

export type IMSetCurrentCurrencyPairID = IAction<'CONFIG:M:SET_CURRENT_CURRENCY_PAIR_ID', string>;

export type IMLoadConfig = IPlainAction<'CONFIG:M:LOAD_CONFIG'>;
export type IMLoadConfigCompleted = IAction<'CONFIG:M:LOAD_CONFIG_COMPLETED', IMConfig>;
export type IMLoadConfigFail = IPlainFailAction<'CONFIG:M:LOAD_CONFIG_FAIL'>;

export type Action = ISetCurrentPresetsLayouts | ISetPresetsHaveUnsavedChanges |
  ILoadSecuritySettings | ILoadSecuritySettingsSuccess | ILoadSecuritySettingsFail |
  ILoadCurrencyPairs | ILoadCurrencyPairsSuccess | ILoadCurrencyPairsFail | ILoadCountries |
  ILoadCountriesSuccess | ILoadCountriesFail |
  ILoadAssetsInfo | ILoadAssetsInfoSuccess | ILoadAssetsInfoFail |
  ILoadUserConfig | ILoadUserConfigSuccess | ILoadUserConfigFail |
  ISaveAssetInfo | ISaveAssetInfoSuccess | ISaveAssetInfoFail |
  ISetUserConfig |
  ISaveUserConfig | ISaveUserConfigSuccess | ISaveUserConfigFail |
  ISaveCurrentPresetsLayouts |
  IMSetCurrentCurrencyPairID
  | ISaveTheme | ISaveThemeSuccess | ISaveThemeFail | ISetTheme
  | IMLoadConfig | IMLoadConfigCompleted | IMLoadConfigFail;
