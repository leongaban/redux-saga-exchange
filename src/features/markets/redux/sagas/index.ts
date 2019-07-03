import { IDependencies } from 'shared/types/app';
import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import * as R from 'ramda';

import * as actions from '../actions';
import * as selectors from '../../redux/data/selectors';
import getErrorMsg from 'shared/helpers/getErrorMsg';
import * as NS from '../../namespace';
import { IMarket, IEditMarketInfo } from 'shared/types/models';

function getSaga(deps: IDependencies) {
  const loadType: NS.ILoad['type'] = 'MARKETS:LOAD';
  const editMarketType: NS.IEditMarket['type'] = 'MARKETS:EDIT_MARKET';

  return function* saga() {
    yield all([
      takeLatest(loadType, executeLoad, deps),
      takeLatest(editMarketType, executeEditMarket, deps),
    ]);
  };
}

function* executeLoad({ api }: IDependencies) {
  try {
    const response: IMarket[] = yield call(api.markets.loadMarkets);
    yield put(actions.loadCompleted(response));
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.loadFailed(message));
  }
}

function* executeEditMarket({ api }: IDependencies, { payload }: NS.IEditMarket) {
  try {
    const editMarketInfo: IEditMarketInfo = yield call(api.markets.editMarket, payload);
    const markets: IMarket[] = yield select(selectors.selectMarkets);
    const editMarketIndex = markets.findIndex(market => market.id === editMarketInfo.id);

    // tslint:disable:max-line-length
    const editedMarket: IMarket = {
      ...markets[editMarketIndex],
      makerFee: editMarketInfo.makerFee !== undefined ? editMarketInfo.makerFee : markets[editMarketIndex].makerFee,
      takerFee: editMarketInfo.takerFee !== undefined ? editMarketInfo.takerFee : markets[editMarketIndex].takerFee,
      minOrderValue: editMarketInfo.minOrderValue !== undefined ? editMarketInfo.minOrderValue : markets[editMarketIndex].minOrderValue,
      minTradeAmount: editMarketInfo.minTradeAmount !== undefined ? editMarketInfo.minTradeAmount : markets[editMarketIndex].minTradeAmount,
      priceScale: editMarketInfo.priceScale !== undefined
        ? editMarketInfo.priceScale
        : markets[editMarketIndex].priceScale,
      amountScale: editMarketInfo.amountScale !== undefined
        ? editMarketInfo.amountScale
        : markets[editMarketIndex].amountScale,
      hidden: editMarketInfo.hidden !== undefined ? editMarketInfo.hidden : markets[editMarketIndex].hidden,
    };

    const newMarkets = R.update(editMarketIndex, editedMarket, markets);
    yield put(actions.editMarketCompleted(newMarkets));
    yield put(actions.setEditMarketModalState(false));
  } catch (error) {
    yield put(actions.editMarketFailed(getErrorMsg(error)));
  }
}

export default getSaga;
