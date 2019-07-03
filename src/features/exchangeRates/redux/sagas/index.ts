import { IDependencies } from 'shared/types/app';
import { SagaIterator } from 'redux-saga';
import { call, put, takeEvery, select, all } from 'redux-saga/effects';
import * as R from 'ramda';

import getErrorMsg from 'shared/helpers/getErrorMsg';

import * as actions from '../actions/index';
import * as selectors from '../data/selectors';
import * as NS from '../../namespace';

const toggleMarketStatus: NS.IToggleMarketFavoriteStatus['type'] = 'EXCHANGE_RATES:TOGGLE_FAVORITE_MARKET_STATUS';
const loadFavoritesType: NS.ILoadFavorites['type'] = 'EXCHANGE_RATES:LOAD_FAVORITES';

function getSaga(deps: IDependencies): () => SagaIterator {
  return function* saga(): SagaIterator {
    yield all([
      takeEvery(toggleMarketStatus, executeToggleMarketStatus, deps),
      takeEvery(loadFavoritesType, executeLoadFavorites, deps),
    ]);
  };
}

function* executeToggleMarketStatus({ api }: IDependencies, { payload: market }: NS.IToggleMarketFavoriteStatus) {
  try {
    const favorites: string[] = yield select(selectors.selectFavorites);
    const favoriteIndex = favorites.findIndex((fav) => fav === market);
    if (favoriteIndex !== -1) {
      yield call(api.exchangeRates.removeFavorite, market);
    } else {
      yield call(api.exchangeRates.addFavorite, market);
    }
    const data = favoriteIndex !== -1 ? R.remove(favoriteIndex, 1, favorites) : R.prepend(market, favorites);
    yield put(actions.toggleMarketFavoriteStatusSuccess(data));
  } catch (error) {
    yield put(actions.toggleMarketFavoriteStatusFail(getErrorMsg(error)));
  }
}

function* executeLoadFavorites({ api }: IDependencies) {
  try {
    const response: string[] = yield call(api.exchangeRates.loadFavorites);
    yield put(actions.loadFavoritesSuccess(response));
  } catch (error) {
    yield put(actions.loadFavoritesFail(getErrorMsg(error)));
  }
}

export default getSaga;
