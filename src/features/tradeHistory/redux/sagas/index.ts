import { put, takeEvery, call, select, all } from 'redux-saga/effects';

import { IDependencies } from 'shared/types/app';
import getErrorMsg from 'shared/helpers/getErrorMsg';

import * as NS from '../../namespace';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { IPagedExtendedTrades } from 'shared/types/models';

function getSaga(deps: IDependencies) {
  const loadType: NS.ILoad['type'] = 'TRADE_HISTORY:LOAD';

  return function* saga() {
    yield all([
      takeEvery(loadType, executeLoad, deps),
    ]);
  };
}

function* executeLoad({ api }: IDependencies, { payload }: NS.ILoad) {
  try {
    const pagesNumber: number = yield select(selectors.selectExtendedTradesTotalPages);
    if (payload.page === pagesNumber) {
      const [requiredPage, nextPage]: [IPagedExtendedTrades, IPagedExtendedTrades] = yield all([
        call(api.tradeHistory.load, payload),
        call(api.tradeHistory.load, { ...payload, page: payload.page + 1 }),
      ]);

      if (nextPage.data.length !== 0) {
        yield put(actions.setExtendedTradesTotalPages(payload.page + 1));
      }
      yield put(actions.loadSuccesss(requiredPage));
    } else {
      const trades: IPagedExtendedTrades = yield call(api.tradeHistory.load, payload);
      yield put(actions.loadSuccesss(trades));
    }
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.loadFail(message));
  }
}

export { getSaga };
