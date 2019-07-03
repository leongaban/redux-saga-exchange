import * as R from 'ramda';
import { createSelector } from 'reselect';

import { IAppReduxState } from 'shared/types/app';
import { IExchangeRate } from 'shared/types/models';
import { selectors as miniTickerDSSelectors } from 'services/miniTickerDataSource';

import { IReduxState } from '../../namespace';
import { counterCurrencies } from '../../constants';

function selectFeatureState(state: IAppReduxState): IReduxState {
  if (!state.exchangeRates) {
    throw new Error('Can\'t find exchangeRates feature state!');
  }
  return state.exchangeRates;
}

export function selectFavorites(state: IAppReduxState): string[] {
  return selectFeatureState(state).data.favorites;
}

export function selectFilteredCounterCurrency(state: IAppReduxState): string | null {
  return selectFeatureState(state).ui.filteredCounterCurrency;
}

export function selectShowOnlyFavorites(state: IAppReduxState): boolean {
  return selectFeatureState(state).ui.showOnlyFavorites;
}

export function selectSearchValue(state: IAppReduxState): string {
  return selectFeatureState(state).ui.searchValue;
}

export const selectExchangeRatesFilter = createSelector(
  selectFavorites,
  selectSearchValue,
  selectFilteredCounterCurrency,
  selectShowOnlyFavorites,
  (favorites, searchValue, filteredCounterCurrency, showOnlyFavorites) => {
    const filters = [];
    if (searchValue) {
      const includesSeachValue = (x: IExchangeRate) => {
        return x.market.replace('_', '/').includes(searchValue.toLowerCase());
      };
      filters.push(includesSeachValue);
    }
    if (showOnlyFavorites) {
      const isFavorite = ({ market }: IExchangeRate) => R.contains(market, favorites);
      filters.push(isFavorite);
    }
    if (filteredCounterCurrency) {
      const containsFilteredCounterCurrency = (x: IExchangeRate) => {
        return filteredCounterCurrency === counterCurrencies.usds
          ? (x.market.includes('_' + counterCurrencies.usdt) || x.market.includes('_' + counterCurrencies.tusd))
          : x.market.includes('_' + filteredCounterCurrency);
      };
      filters.push(containsFilteredCounterCurrency);
    }
    return R.filter(R.allPass(filters));

  },
);

export const selectFilteredExchangeRates = createSelector(
  miniTickerDSSelectors.selectExchangeRates,
  selectExchangeRatesFilter,
  (exchangeRates, filter) => {
    return filter(exchangeRates);

  },
);
