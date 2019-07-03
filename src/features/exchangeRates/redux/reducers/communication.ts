import { combineReducers } from 'redux';
import * as NS from '../../namespace';
import { initial } from '../data/initial';
import makeCommunicationReducer from 'shared/helpers/redux/communication/makeCommunicationReducer';

// tslint:disable:max-line-length
export default combineReducers<NS.IReduxState['communication']>({
  loadFavorites: makeCommunicationReducer<NS.ILoadFavorites, NS.ILoadFavoritesSuccess, NS.ILoadFavoritesFail>(
    'EXCHANGE_RATES:LOAD_FAVORITES',
    'EXCHANGE_RATES:LOAD_FAVORITES_SUCCESS',
    'EXCHANGE_RATES:LOAD_FAVORITES_FAIL',
    initial.communication.loadFavorites,
  ),
  toggleMarketStatus: makeCommunicationReducer<NS.IToggleMarketFavoriteStatus, NS.IToggleMarketFavoriteStatusSuccess, NS.IToggleMarketFavoriteStatusFail>(
    'EXCHANGE_RATES:TOGGLE_FAVORITE_MARKET_STATUS',
    'EXCHANGE_RATES:TOGGLE_FAVORITE_MARKET_STATUS_SUCCESS',
    'EXCHANGE_RATES:TOGGLE_FAVORITE_MARKET_STATUS_FAIL',
    initial.communication.toggleMarketStatus,
),
});
