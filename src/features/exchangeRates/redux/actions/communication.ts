import { makeCommunicationActionCreators } from 'shared/helpers/redux/index';
import * as NS from '../../namespace';

/* tslint:disable:max-line-length */
export const { execute: toggleMarketFavoriteStatus, completed: toggleMarketFavoriteStatusSuccess, failed: toggleMarketFavoriteStatusFail } =
  makeCommunicationActionCreators<NS.IToggleMarketFavoriteStatus, NS.IToggleMarketFavoriteStatusSuccess, NS.IToggleMarketFavoriteStatusFail>(
    'EXCHANGE_RATES:TOGGLE_FAVORITE_MARKET_STATUS', 'EXCHANGE_RATES:TOGGLE_FAVORITE_MARKET_STATUS_SUCCESS', 'EXCHANGE_RATES:TOGGLE_FAVORITE_MARKET_STATUS_FAIL',
  );

export const { execute: loadFavorites, completed: loadFavoritesSuccess, failed: loadFavoritesFail } =
  makeCommunicationActionCreators<NS.ILoadFavorites, NS.ILoadFavoritesSuccess, NS.ILoadFavoritesFail>(
    'EXCHANGE_RATES:LOAD_FAVORITES', 'EXCHANGE_RATES:LOAD_FAVORITES_SUCCESS', 'EXCHANGE_RATES:LOAD_FAVORITES_FAIL',
  );
