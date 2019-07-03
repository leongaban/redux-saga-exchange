import { IExchangeRate, ICurrencyPair, OrderValueFormatter } from 'shared/types/models';
import { selectors as configSelectors } from 'services/config';
import { IAppReduxState } from 'shared/types/app';

import { selectors } from '../../../redux';

export interface IStateProps {
  filteredExchangeRates: IExchangeRate[];
  favorites: string[];
  currencyPairs: ICurrencyPair[];
  showOnlyFavorites: boolean;
  counterCurrency: string | null;
  searchValue: string;
  formatPrice: OrderValueFormatter;
  formatVolume: OrderValueFormatter;
}

export function mapState(state: IAppReduxState): IStateProps {
  return {
    filteredExchangeRates: selectors.selectFilteredExchangeRates(state),
    favorites: selectors.selectFavorites(state),
    currencyPairs: configSelectors.selectCurrencyPairs(state),
    showOnlyFavorites: selectors.selectShowOnlyFavorites(state),
    counterCurrency: selectors.selectFilteredCounterCurrency(state),
    searchValue: selectors.selectSearchValue(state),
    formatPrice: configSelectors.selectOrderPriceFormatter(state),
    formatVolume: configSelectors.selectOrderVolumeFormatter(state),
  };
}
