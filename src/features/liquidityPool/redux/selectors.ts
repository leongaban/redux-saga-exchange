import { createSelector } from 'reselect';
import { IAppReduxState } from 'shared/types/app';
import { ICommunication } from 'shared/types/redux';
import * as R from 'ramda';
import * as NS from '../namespace';
import { ILPAsset } from 'shared/types/models/liquidityPool';
import { selectors as configSelectors } from 'services/config';
import { selectors as miniTickerSelectors } from 'services/miniTickerDataSource';
import { currencyPathBFS, convertCurrency } from 'shared/helpers/currencyConverter';

export function selectFeatureState(state: IAppReduxState): NS.IReduxState {
  return state.liquidityPool;
}

export const selectAssets = createSelector(
  configSelectors.selectCurrencyGraph,
  selectConversionCurrency,
  miniTickerSelectors.selectExchangeRatesDict,
  (state: IAppReduxState) => selectFeatureState(state).data.assets,
  (currencyGraph, conversionCurrency, exchangeRatesDict, assets): ILPAsset[] => {
    if (currencyGraph === 'pending' || Object.keys(exchangeRatesDict).length === 0) {
      return [];
    }

    return assets.map(asset => {
      const path = currencyPathBFS(asset.symbol.toLowerCase(), conversionCurrency, currencyGraph);
      const convertedLastPayout = path ? convertCurrency(asset.lastPayout, path, exchangeRatesDict) : null;
      const convertedHistorical = path ? convertCurrency(asset.historical, path, exchangeRatesDict) : null;

      return {
        symbol: asset.symbol,
        lastPayout: convertedLastPayout ? convertedLastPayout.toNumber() : 0,
        historical: convertedHistorical ? convertedHistorical.toNumber() : 0,
      };
    });
  });

export const selectTotalPayoutValue = createSelector(
  selectAssets,
  (assets) => {
    return R.sum(assets.map(x => x.historical));
  });

export function selectAssetFilter(state: IAppReduxState): string {
  return selectFeatureState(state).edit.assetFilter;
}

export function selectConversionCurrency(state: IAppReduxState): string {
  return selectFeatureState(state).edit.conversionCurrency;
}

export function selectCanUseLiquidityPool(state: IAppReduxState): boolean {
  return selectFeatureState(state).data.useLiquidityPool;
}

export function selectGetTotalTIO(state: IAppReduxState): number {
  return selectFeatureState(state).data.totalTio;
}

export function selectTimeValid(state: IAppReduxState): boolean {
  return selectFeatureState(state).data.timeValid;
}

export function selectLastPayoutTs(state: IAppReduxState): string {
  return selectFeatureState(state).data.lastPayoutTs;
}

export function selectPandaDocUrl(state: IAppReduxState): string | undefined {
  return selectFeatureState(state).data.pandaDocUrl;
}

export function selectPandaDocId(state: IAppReduxState): string {
  return selectFeatureState(state).data.pandaDocId;
}

export function selectPandaDocUrlFetching(state: IAppReduxState): boolean {
  return selectFeatureState(state).communication.postLoanAgreement.isRequesting;
}

export const selectCurrencyConverter = createSelector(
  configSelectors.selectCurrencyGraph,
  miniTickerSelectors.selectExchangeRatesDict,
  selectConversionCurrency,
  (_: IAppReduxState, convertableCurrency: string) => convertableCurrency,
  (currencyGraph, exchangeRatesDict, conversionCurrency, convertableCurrency) => {

    if (currencyGraph === 'pending' || Object.keys(exchangeRatesDict).length === 0) {
      return (_: number) => 0;
    }
    const path = currencyPathBFS(convertableCurrency, conversionCurrency, currencyGraph);
    return path
      ? (value: number) => {
        const converted = convertCurrency(value, path, exchangeRatesDict);
        return converted ? converted.toNumber() : 0;
      }
      : (_: number) => 0;
  }
);

export const selectConvertedTotalTio = createSelector(
  selectGetTotalTIO,
  (state: IAppReduxState) => selectCurrencyConverter(state, 'tiox'),
  (totalTio, converter): number => {
    return converter(totalTio);
  });

export const selectTioPrice = createSelector(
  (state: IAppReduxState) => selectCurrencyConverter(state, 'tiox'),
  (converter): number => {
    return converter(1);
  });

export function selectTioLocked(state: IAppReduxState): number {
  return selectFeatureState(state).data.tioLocked;
}

export const selectConvertedTioLocked = createSelector(
  selectTioLocked,
  (state: IAppReduxState) => selectCurrencyConverter(state, 'tiox'),
  (tioLocked, converter): number => {
    return converter(tioLocked);
  });

export function selectIsUseLiquidityPoolFetching(state: IAppReduxState): boolean {
  return selectFeatureState(state).communication.getUseLiquidityPool.isRequesting;
}

export function selectCommunication(state: IAppReduxState, key: keyof NS.IReduxState['communication']): ICommunication {
  return selectFeatureState(state).communication[key];
}
