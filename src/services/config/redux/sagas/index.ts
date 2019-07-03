import { takeLatest, put, call, select, all, take, fork } from 'redux-saga/effects';
import getErrorMsg from 'shared/helpers/getErrorMsg';
import {
  ICurrencyPair, ICountry, IUserConfig, IPreset, IPresetLayouts, IAssetsInfoMap, IMConfig, IHoldingTheme,
} from 'shared/types/models';
import { IDependencies } from 'shared/types/app';
import { convertToPresetLayouts } from 'shared/helpers/converters';
import { arePresetsLayoutsChanged, changePresetsLayouts } from 'shared/helpers/presets';
import { actions as notificationActions } from 'services/notification';

import * as actions from '../actions';
import * as NS from '../../namespace';
import * as selectors from '../data/selectors';
import { getAssetIdFromAssetName } from '../helpers';
import { UITheme } from 'shared/types/ui';

export default function getSaga(deps: IDependencies) {
  const loadSecuritySettingsType: NS.ILoadSecuritySettings['type'] = 'CONFIG:LOAD_SECURITY_SETTINGS';
  const loadCurrencyPairsType: NS.ILoadCurrencyPairs['type'] = 'CONFIG:LOAD_CURRENCY_PAIRS';
  const loadCountriesType: NS.ILoadCountries['type'] = 'CONFIG:LOAD_COUNTRIES';
  const loadAssetsInfoType: NS.ILoadAssetsInfo['type'] = 'CONFIG:LOAD_ASSETS_INFO';
  const loadUserConfigType: NS.ILoadUserConfig['type'] = 'CONFIG:LOAD_USER_CONFIG';
  const setCurrentPresetsLayoutsType: NS.ISetCurrentPresetsLayouts['type'] = 'CONFIG:SET_CURRENT_PRESETS_LAYOUTS';
  const saveCurrentPresetsLayoutsType: NS.ISaveCurrentPresetsLayouts['type'] = 'CONFIG:SAVE_CURRENT_PRESETS_LAYOUTS';
  const saveAssetInfoType: NS.ISaveAssetInfo['type'] = 'CONFIG:SAVE_ASSET_INFO';
  const saveUserConfigType: NS.ISaveUserConfig['type'] = 'CONFIG:SAVE_USER_CONFIG';
  const saveThemeType: NS.ISaveTheme['type'] = 'CONFIG:SAVE_THEME';
  const mLoadConfigType: NS.IMLoadConfig['type'] = 'CONFIG:M:LOAD_CONFIG';
  const mSetCurrentCurrencyPairIDType: NS.IMSetCurrentCurrencyPairID['type'] = 'CONFIG:M:SET_CURRENT_CURRENCY_PAIR_ID';

  function* saga() {
    yield all([
      takeLatest(loadSecuritySettingsType, loadSecuritySettingsSaga, deps),
      takeLatest(loadCurrencyPairsType, executeLoadCurrencyPairs, deps),
      takeLatest(loadCountriesType, executeLoadCountries, deps),
      takeLatest(loadAssetsInfoType, executeLoadAssetsInfo, deps),
      takeLatest(loadUserConfigType, executeLoadUserConfig, deps),
      takeLatest(setCurrentPresetsLayoutsType, executeSetCurrentPresetsLayoutsSaga),
      takeLatest(saveCurrentPresetsLayoutsType, executeSaveCurrentPresetsLayoutsTypeSaga),
      takeLatest(saveAssetInfoType, executeSaveAssetInfoSaga, deps),
      takeLatest(saveUserConfigType, executeSaveUserConfig, deps),
      takeLatest(saveThemeType, executeSaveTheme, deps),
      takeLatest(mLoadConfigType, executeMLoadConfigSaga, deps),
      takeLatest(mSetCurrentCurrencyPairIDType, executeMSetCurrentCurrencyPairIDSaga, deps),
      yield fork(executeMInitializeCurrectCurrencyPairSaga, deps),
    ]);
  }

  return saga;
}

export function* loadSecuritySettingsSaga(deps: IDependencies) {
  try {
    const response: NS.ISecuritySettings = {
      loginTriesBeforeCaptcha: 5,
      loginTriesBeforeLock: 10,
      loginRetryPeriod: 30000,
      restorePassTriesBeforeLock: 5,
      restorePassRetryPeriod: 30000,
    };
    yield put(actions.loadSecuritySettingSuccess(response));
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.loadSecuritySettingFail(message));
  }
}

export function* executeLoadCurrencyPairs(deps: IDependencies) {
  try {
    const currencyPairs: ICurrencyPair[] = yield call(deps.api.config.loadCurrencyPairs);
    yield put(actions.loadCurrencyPairsSuccess(currencyPairs));
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.loadCurrencyPairsFail(message));
  }
}

export function* executeLoadCountries(deps: IDependencies, action: NS.ILoadCountries) {
  try {
    const countries: ICountry[] = yield call(deps.api.config.loadCountries, action.payload);
    yield put(actions.loadCountriesSuccess(countries));
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.loadCountriesFail(message));
  }
}

export function* executeLoadAssetsInfo(deps: IDependencies) {
  try {
    const assetsInfo = yield call(deps.api.config.loadAssetsInfo);
    yield put(actions.loadAssetsInfoSuccess(assetsInfo));
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.loadAssetsInfoFail(message));
  }
}

export function* executeLoadUserConfig({ api }: IDependencies) {
  try {
    const { theme, ...userConfig }: IUserConfig & IHoldingTheme = yield call(api.config.loadUserConfig);
    yield put(actions.setCurrentPresetsLayouts(userConfig.presets.map(convertToPresetLayouts)));
    yield put(actions.setTheme(theme));
    yield put(actions.loadUserConfigSuccess(userConfig));
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.loadUserConfigFail(message));
  }
}

export function* executeSaveCurrentPresetsLayoutsTypeSaga() {
  const presets: IPreset[] = yield select(selectors.selectPresets);
  const currentPresetsLayouts: IPresetLayouts[] = yield select(selectors.selectCurrentPresetsLayouts);
  const newPresets = changePresetsLayouts(presets, currentPresetsLayouts);

  yield put(actions.saveUserConfig({
    presets: newPresets,
  }));

  yield put(actions.setPresetsHaveUnsavedChanges(false));
}

export function* executeSetCurrentPresetsLayoutsSaga() {
  const presets: IPreset[] = yield select(selectors.selectPresets);
  const currentPresetsLayouts: IPresetLayouts[] = yield select(selectors.selectCurrentPresetsLayouts);
  if (arePresetsLayoutsChanged(currentPresetsLayouts, presets)) {
    yield put(actions.setPresetsHaveUnsavedChanges(true));
  } else {
    yield put(actions.setPresetsHaveUnsavedChanges(false));
  }
}

export function* executeSaveAssetInfoSaga({ api }: IDependencies, { payload }: NS.ISaveAssetInfo) {
  try {
    const assetsInfo: IAssetsInfoMap = yield select(selectors.selectAssetsInfo);
    const assetId: string | undefined = getAssetIdFromAssetName(payload.assetName, assetsInfo);

    if (assetId) {
      yield call(api.config.updateAsset, assetId, payload);
      yield put(actions.saveAssetInfoSuccess(payload));
    }
  }
  catch (error) {
    const message = getErrorMsg(error);
    yield put(notificationActions.setNotification({ kind: 'error', text: message }));
    yield put(actions.saveAssetInfoFail(message));
  }
}

export function* executeSaveUserConfig({ api }: IDependencies, { payload }: NS.ISaveUserConfig) {
  try {
    const storedConfig: IUserConfig | null = yield select(selectors.selectUserConfig);
    const theme: UITheme = yield select(selectors.selectUITheme);
    if (storedConfig) {
      const userConfig: IUserConfig & IHoldingTheme = {
        ...storedConfig,
        ...payload,
        theme,
      };

      yield call(api.config.setUserConfig, userConfig);
      yield put(actions.saveUserConfigSuccess());
    } else {
      console.warn('Trying to save userConfig, but it not initialized yet', payload);
    }
  }
  catch (error) {
    const message = getErrorMsg(error);
    yield put(notificationActions.setNotification({ kind: 'error', text: message }));
    yield put(actions.saveUserConfigFail(message));
  }
}

export function* executeSaveTheme({ api }: IDependencies, { payload }: NS.ISaveTheme) {
  try {
    const storedConfig: IUserConfig | null = yield select(selectors.selectUserConfig);
    if (storedConfig) {
      const userConfig: IUserConfig & IHoldingTheme = {
        ...storedConfig,
        theme: payload,
      };

      yield call(api.config.setUserConfig, userConfig);
      yield put(actions.saveThemeSuccess());
    } else {
      console.warn('Trying to save theme, but config is not initialized yet', payload);
    }
  }
  catch (error) {
    const message = getErrorMsg(error);
    yield put(notificationActions.setNotification({ kind: 'error', text: message }));
    yield put(actions.saveThemeFail(message));
  }
}

export function* executeMSetCurrentCurrencyPairIDSaga({ api }: IDependencies) {
  // TODO refactor with subscribing to state change
  const config: IMConfig = yield select(selectors.mSelectConfig);
  try {
    yield call(api.config.mSaveConfig, config);
  } catch (error) {
    const message = getErrorMsg(error);
    console.error('could not save config', message);
  }
}

export function* executeMLoadConfigSaga({ api }: IDependencies) {
  try {
    const mConfig: IMConfig = yield call(api.config.mLoadConfig);
    yield put(actions.mLoadConfigCompleted(mConfig));
  }
  catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.mLoadConfigFail(message));
  }
}

export function* executeMInitializeCurrectCurrencyPairSaga() {
  const mLoadConfigCompletedType: NS.IMLoadConfigCompleted['type'] = 'CONFIG:M:LOAD_CONFIG_COMPLETED';
  const loadCurrencyPairsCompletedType: NS.ILoadCurrencyPairsSuccess['type'] = 'CONFIG:LOAD_CURRENCY_PAIRS_SUCCESS';

  const [
    { payload: { selectedCurrecyPairID } },
    { payload: pairs },
  ]: [NS.IMLoadConfigCompleted, NS.ILoadCurrencyPairsSuccess] = yield all([
    take(mLoadConfigCompletedType),
    take(loadCurrencyPairsCompletedType),
  ]);

  if (selectedCurrecyPairID === null) {

    const notHiddenPairs = pairs.filter(x => !x.hidden);

    if (notHiddenPairs.length > 0) {
      yield put(actions.mSetCurrentCurrencyPairID(notHiddenPairs[0].id));
    } else {
      console.error('no currency pairs on current currency pair initialization');
    }
  } else {
    yield put(actions.mSetCurrentCurrencyPairID(selectedCurrecyPairID));
  }
}
