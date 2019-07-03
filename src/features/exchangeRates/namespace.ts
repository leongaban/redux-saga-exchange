import { ICommunication, IAction, IPlainFailAction, IPlainAction } from 'shared/types/redux';
import { ExchangeRatePeriod } from 'shared/types/models';

export interface IReduxState {
  communication: {
    toggleMarketStatus: ICommunication,
    loadFavorites: ICommunication,
  };
  data: {
    favorites: string[];
  };
  ui: {
    filteredCounterCurrency: string | null;
    showOnlyFavorites: boolean;
    searchValue: string;
  };
}

export interface IPeriodOption {
  id: ExchangeRatePeriod;
  title: string;
  shortTitle?: string;
}

export type ILoadFavorites = IPlainAction<'EXCHANGE_RATES:LOAD_FAVORITES'>;
export type ILoadFavoritesSuccess = IAction<'EXCHANGE_RATES:LOAD_FAVORITES_SUCCESS', string[]>;
export type ILoadFavoritesFail = IPlainFailAction<'EXCHANGE_RATES:LOAD_FAVORITES_FAIL'>;

export type ISetShowOnlyFavorites = IAction<'EXCHANGE_RATES:SET_SHOW_ONLY_FAVORITES', boolean>;
export type ISetFilteredCounterCurrency = IAction<'EXCHANGE_RATES:SET_FILTERED_COUNTER_CURRENCY', string | null>;
export type ISetSearchValue = IAction<'EXCHANGE_RATES:SET_SEARCH_VALUE', string>;

export type IResetUI = IPlainAction<'EXCHANGE_RATES:RESET_UI'>;

/* tslint:disable:max-line-length */
export type IToggleMarketFavoriteStatus = IAction<'EXCHANGE_RATES:TOGGLE_FAVORITE_MARKET_STATUS', string>;
export type IToggleMarketFavoriteStatusSuccess = IAction<'EXCHANGE_RATES:TOGGLE_FAVORITE_MARKET_STATUS_SUCCESS', string[]>;
export type IToggleMarketFavoriteStatusFail = IPlainFailAction<'EXCHANGE_RATES:TOGGLE_FAVORITE_MARKET_STATUS_FAIL'>;
/* tslint:enable:max-line-length */
export type Action = IToggleMarketFavoriteStatus | IToggleMarketFavoriteStatusSuccess | IToggleMarketFavoriteStatusFail
  | ILoadFavorites | ILoadFavoritesSuccess | ILoadFavoritesFail | ISetFilteredCounterCurrency | ISetShowOnlyFavorites
  | ISetSearchValue | IResetUI;
