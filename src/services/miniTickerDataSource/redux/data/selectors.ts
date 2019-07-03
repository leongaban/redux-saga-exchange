import { createSelector } from 'reselect';

import { selectors as configSelectors } from 'services/config';
import { IAppReduxState } from 'shared/types/app';
import { IExchangeRate, IExchangeRateDict } from 'shared/types/models';
import { currencyPathBFS, convertCurrency } from 'shared/helpers/currencyConverter';
import { fractionalPartLengths } from 'shared/constants';

import * as NS from '../../namespace';

export function getFeatureState(state: IAppReduxState): NS.IReduxState {
  return state.miniTickerDataSource;
}

export function selectExchangeRatesDict(state: IAppReduxState): IExchangeRateDict {
  return getFeatureState(state).data.exchangeRates;
}

export const selectExchangeRates = createSelector(
  selectExchangeRatesDict,
  configSelectors.selectCurrencyPairs,
  (dict, pairs): IExchangeRate[] => {
    return Object.values(dict).filter(rate => {
      const pair = pairs.find(x => x.id === rate.market);
      return Boolean(pair && !pair.hidden);
    });
  },
);

export const selectCurrentMarketTick = createSelector(
  selectExchangeRatesDict,
  (_: IAppReduxState, market: string) => market,
  (dict, market): IExchangeRate | undefined => {
    return dict[market];
  },
);

export const selectCurrentMarketPrice = createSelector(
  selectCurrentMarketTick,
  (_: IAppReduxState, market: string) => market,
  (currentTick): number => {
    return currentTick ? currentTick.current : 0;
  },
);

export const selectQuoteCurrencyToUSDTConverter = createSelector(
  configSelectors.selectCurrencyGraph,
  selectExchangeRatesDict,
  (_: IAppReduxState, convertableCurrency: string) => convertableCurrency,
  (currencyGraph, exchangeRatesDict, convertableCurrency): NS.CurrencyConverter => {

    if (currencyGraph === 'pending' || Object.keys(exchangeRatesDict).length === 0) {
      return (_: number | string) => '';
    }

    const path = currencyPathBFS(convertableCurrency, 'usdt', currencyGraph);
    return path
      ? (value: number | string) => {
        const converted = convertCurrency(value, path, exchangeRatesDict);
        return converted
          ? converted.toFixed(fractionalPartLengths.usdt)
          : null;
      }
      : (_: number | string) => '';
  }
);
