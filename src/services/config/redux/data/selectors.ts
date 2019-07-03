import { createSelector } from 'reselect';
import * as R from 'ramda';

import { IAppReduxState } from 'shared/types/app';
import { ICommunication } from 'shared/types/redux';
import { UITheme, ClientDeviceType } from 'shared/types/ui';
import {
  ICurrencyPair, ICountry, IAssetsInfoMap, IPreset, IPresetLayouts, IUserConfig, ISavedWithdrawalAddresses,
  IExchangeRatesSettings, WidgetsSettings, OrderValueFormatter, CurrencyPairByIDGetter, IMConfig,
  IReportsSettings,
} from 'shared/types/models';
import { makeCurrencyGraph } from 'shared/helpers/currencyConverter';
import { floorFloatToFixed } from 'shared/helpers/number';
import { defaultUserConfig } from 'shared/constants';

import * as NS from '../../namespace';

function selectFeatureState(state: IAppReduxState): NS.IReduxState {
  if (!state) {
    throw new Error('Cannot find config service state!');
  }
  return state.config;
}

export function selectSecuritySettings(state: IAppReduxState): NS.ISecuritySettings {
  return selectFeatureState(state).data.securitySettings;
}

export function selectAssetsInfo(state: IAppReduxState): IAssetsInfoMap {
  return selectFeatureState(state).data.assetsInfo;
}

export function selectCommunicationLoadAssetsInfo(state: IAppReduxState): ICommunication {
  return selectFeatureState(state).communication.loadAssetsInfo;
}

export function selectCommunication(state: IAppReduxState, key: keyof NS.IReduxState['communication']): ICommunication {
  return selectFeatureState(state).communication[key];
}

export const selectAssetsCodes = createSelector(
  selectAssetsInfo,
  (assets: IAssetsInfoMap) =>
    Object.keys(assets),
);

export function selectCurrencyPairs(state: IAppReduxState): ICurrencyPair[] {
  return selectFeatureState(state).data.currencyPairs;
}

export const selectNotHiddenCurrencyPairs = createSelector(
  selectCurrencyPairs,
  (pairs) => pairs,
);

export function selectLoadCurrencyPairsCommunication(state: IAppReduxState): ICommunication {
  return selectFeatureState(state).communication.loadCurrencyPairs;
}

export const selectCurrencyGraph = createSelector(
  selectCurrencyPairs,
  selectLoadCurrencyPairsCommunication,
  (pairs, communication) => communication.isRequesting
    ? 'pending'
    : makeCurrencyGraph(pairs),
);

export const selectBaseCurrenciesGetter = createSelector(
  selectCurrencyPairs,
  (pairs) =>
    R.memoizeWith(R.identity, (counterCurrency: string) =>
      R.uniq(
        counterCurrency
          ? pairs
            .filter(x => x.counterCurrency === counterCurrency)
            .map(x => x.baseCurrency)
          : pairs.map(x => x.baseCurrency))));

export const selectCounterCurrenciesGetter = createSelector(
  selectCurrencyPairs,
  (pairs) =>
    R.memoizeWith(R.identity, (baseCurrency?: string) =>
      R.uniq(
        baseCurrency
          ? pairs
            .filter(x => x.baseCurrency === baseCurrency)
            .map(x => x.counterCurrency)
          : pairs.map(x => x.counterCurrency))));

export function selectCurrencyPairById(state: IAppReduxState, id: string): ICurrencyPair | null {
  const currencyPairs = selectNotHiddenCurrencyPairs(state);
  const requiredPair = currencyPairs.find(currencyPair => currencyPair.id === id);

  if (requiredPair) {
    return requiredPair;
  }

  console.warn('could not find required pair', id, 'in', currencyPairs);
  if (currencyPairs.length > 0) {
    return currencyPairs[0];
  }

  return null;
}

export function selectCounties(state: IAppReduxState): ICountry[] {
  return selectFeatureState(state).data.countries;
}

export const selectUserConfig = createSelector(
  (state: IAppReduxState) => selectFeatureState(state).data.userConfig,
  (userConfig): IUserConfig | null => {
    return userConfig !== null
      ? userConfig
      : null;
  },
);

export const selectReportsSettings = createSelector(
  selectUserConfig,
  (userConfig): IReportsSettings => {
    return userConfig !== null ? userConfig.reportsSettings : defaultUserConfig.reportsSettings;
  },
);

export const selectSavedWithdrawalAddresses = createSelector(
  selectUserConfig,
  (userConfig): ISavedWithdrawalAddresses => {
    return userConfig !== null ? userConfig.savedWithdrawalAddresses : {};
  },
);

export const selectAreTOSAccepted = createSelector(
  selectUserConfig,
  (userConfig): boolean => {
    return userConfig !== null ? userConfig.areTOSAccepted : true;
  },
);

export const selectIsSecurityNoticeConfirmed = createSelector(
  selectUserConfig,
  (userConfig): boolean => {
    return userConfig !== null ? userConfig.isSecurityNoticeConfirmed : true;
  },
);

export const selectHideSmallBalances = createSelector(
  selectUserConfig,
  (userConfig): boolean => {
    return userConfig !== null ? userConfig.hideSmallBalances : false;
  },
);

export const selectShouldOpenMarketOrderWarningModal = createSelector(
  selectUserConfig,
  (userConfig): boolean => {
    return userConfig !== null
      ? userConfig.shouldOpenMarketOrderWarningModal
      : defaultUserConfig.shouldOpenMarketOrderWarningModal;
  },
);

export const selectPresets = createSelector(
  selectUserConfig,
  (userConfig): IPreset[] => {
    return userConfig !== null ? userConfig.presets : [];
  },
);

export const selectActivePresetName = createSelector(
  selectUserConfig,
  (userConfig): string | null => {
    return userConfig !== null ? userConfig.activePresetName : null;
  },
);

export function selectUITheme(state: IAppReduxState): UITheme {
  return selectFeatureState(state).ui.theme;
}

export function selectClientDeviceType(state: IAppReduxState): ClientDeviceType {
  return selectFeatureState(state).ui.clientDeviceType;
}

export function selectCurrentPresetsLayouts(state: IAppReduxState): IPresetLayouts[] {
  return selectFeatureState(state).edit.currentPresetsLayouts;
}

export function selectPresetsHaveUnsavedChanges(state: IAppReduxState) {
  return selectFeatureState(state).edit.presetsHaveUnsavedChanges;
}

export const selectActivePreset = createSelector(
  selectCurrentPresetsLayouts,
  selectPresets,
  selectActivePresetName,
  (currentPresetLayouts, presets, presetName) => {
    const currentPresetLayout = currentPresetLayouts.find(x => x.name === presetName);
    const preset = presets.find(x => x.name === presetName);
    if (currentPresetLayout && preset) {
      return {
        ...currentPresetLayout,
        settings: { ...preset.settings },
      };
    }
  },
);

export function selectLoadUserSettingsCommunication(state: IAppReduxState) {
  return selectFeatureState(state).communication.loadUserConfig;
}

export function selectLgLayoutsFromActivePreset(state: IAppReduxState) {
  const activePreset = selectActivePreset(state);
  if (activePreset) {
    return activePreset.layouts.lg;
  }
  return undefined;
}

export function selectWidgetsSettings(state: IAppReduxState): WidgetsSettings | undefined {
  const activePreset = selectActivePreset(state);
  if (activePreset) {
    return activePreset.settings;
  }
}

export function selectCurrentCurrencyPairID(state: IAppReduxState) {
  const lg = selectLgLayoutsFromActivePreset(state);
  const widgetSettings = selectWidgetsSettings(state);
  if (lg && widgetSettings) {
    const exchangeRatesLayout = lg.find(layout => layout.kind === 'exchange-rates');
    if (exchangeRatesLayout) {
      const exchangeRatesSettings =
        widgetSettings[exchangeRatesLayout.kind][exchangeRatesLayout.i!] as IExchangeRatesSettings;
      return exchangeRatesSettings.currentMarketId;
    }
  }
}

export function selectCurrentCurrencyPair(state: IAppReduxState): ICurrencyPair | null {
  const currentCurrencyPairID = selectCurrentCurrencyPairID(state);
  return selectCurrencyPairById(state, currentCurrencyPairID || '');
}

export function selectCurrencyPairByIDGetter(state: IAppReduxState): CurrencyPairByIDGetter {
  const currencyPairs = selectCurrencyPairs(state);
  return (id: string): ICurrencyPair | undefined => currencyPairs.find(x => x.id.toLowerCase() === id.toLowerCase());
}

export function selectOrderValueFormatter(
  state: IAppReduxState,
  scaleProperty: Extract<keyof ICurrencyPair, 'priceScale' | 'amountScale'>,
): OrderValueFormatter {
  return (market: string, orderValue: number, fallbackScale: number = 2) => {
    const pair = selectCurrencyPairByIDGetter(state)(market);
    const scale = (() => {
      if (pair === void 0) {
        const formattedProperty = scaleProperty.replace('Scale', '');
        console.warn(`could not find a pair with id ${market} while formatting a ${formattedProperty}`);
        return fallbackScale;
      }
      return pair[scaleProperty];
    })();
    return floorFloatToFixed(orderValue, scale);
  };
}

export function selectOrderPriceFormatter(state: IAppReduxState): OrderValueFormatter {
  return selectOrderValueFormatter(state, 'priceScale');
}

export function selectOrderVolumeFormatter(state: IAppReduxState): OrderValueFormatter {
  return selectOrderValueFormatter(state, 'amountScale');
}

export function mSelectCurrentCurrencyPairID(state: IAppReduxState): string | null {
  return selectFeatureState(state).edit.mobile.currentCurrencyPairID;
}

export function mSelectCurrentCurrencyPair(state: IAppReduxState): ICurrencyPair | null {
  const id = mSelectCurrentCurrencyPairID(state);
  return id === null
    ? null
    : selectCurrencyPairById(state, id);
}

export function mSelectConfig(state: IAppReduxState): IMConfig {
  return {
    selectedCurrecyPairID: mSelectCurrentCurrencyPairID(state)
  };
}
export function selectUserAgentData(state: IAppReduxState): IUAParser.IResult {
  return selectFeatureState(state).data.userAgent;
}

export function selectBrowserName(state: IAppReduxState): string | undefined {
  return selectUserAgentData(state).browser.name;
}

export function selectUserOS(state: IAppReduxState): string | undefined {
  return selectUserAgentData(state).os.name;
}
