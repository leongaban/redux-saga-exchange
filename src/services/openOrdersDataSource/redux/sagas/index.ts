import { put, takeEvery, race, take, takeLatest, call, select, all } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as R from 'ramda';

import { IDependencies } from 'shared/types/app';
import getErrorMsg from 'shared/helpers/getErrorMsg';
import { envLogger } from 'shared/helpers/debug';
import SocketSubscriber from 'services/sockets/SocketSubscriber';
import { convertToActiveOrder, convertToArchiveOrder } from 'shared/helpers/converters';
import { IArchiveOrder, IPagedArchiveOrders, IServerOrder } from 'shared/types/models';
import { getSortComparator } from 'shared/helpers/sort';

import * as actions from '../actions';
import * as NS from '../../namespace';
import * as selectors from '../data/selectors';

const subscriber: SocketSubscriber = new SocketSubscriber();
const openOrdersLogger = envLogger(__filename, 'openOrders');

const subscribeType: NS.ISubscribe['type'] = 'OPEN_ORDERS_DATA_SOURCE:SUBSCRIBE';
const unsubscribeType: NS.IUnsubscribe['type'] = 'OPEN_ORDERS_DATA_SOURCE:UNSUBSCRIBE';
const loadArchiveOfOrdersType: NS.ILoadArchiveOfOrders['type'] = 'OPEN_ORDERS_DATA_SOURCE:LOAD_ARCHIVE_OF_ORDERS';
const loadFilteredOrdersType: NS.ILoadFilteredOrders['type'] = 'OPEN_ORDERS_DATA_SOURCE:LOAD_FILTERED_ORDERS';

function getSaga(deps: IDependencies) {
  function* saga() {
    yield all([
      takeEvery(subscribeType, executeSubscribeSaga, deps),
      takeLatest(loadArchiveOfOrdersType, executeLoadArchiveOfOrders, deps),
      takeLatest(loadFilteredOrdersType, executeLoadFilteredOrders, deps),
    ]);
  }

  return saga;
}

function* executeLoadArchiveOfOrders({ api }: IDependencies) {
  try {
    const archiveOrders: IArchiveOrder[] = yield call(api.orders.loadArchiveOfOrders);
    const lastHundred = R.sort(
      getSortComparator<IArchiveOrder>({ column: 'datePlaced', kind: 'date', direction: 'descend' }),
      archiveOrders).slice(0, 100);

    yield put(actions.loadArchiveOfOrdersCompleted(lastHundred));
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.loadArchiveOfOrdersFailed(message));
  }
}

function* executeLoadFilteredOrders({ api }: IDependencies, { payload }: NS.ILoadFilteredOrders) {
  try {
    const pagesNumber: number = yield select(selectors.selectReportArchiveOrdersTotalPages);
    if (payload.page === pagesNumber) {
      const [requiredPage, nextPage]: [IPagedArchiveOrders, IPagedArchiveOrders] = yield all([
        call(api.orders.loadPagedArchiveOfOrders, payload),
        call(api.orders.loadPagedArchiveOfOrders, { ...payload, page: payload.page + 1 }),
      ]);

      if (nextPage.data.length !== 0) {
        yield put(actions.setReportArchiveTotalPages(payload.page + 1));
      }
      yield put(actions.loadFilteredOrdersCompleted(requiredPage));

    } else {
      const orders: IPagedArchiveOrders = yield call(api.orders.loadPagedArchiveOfOrders, payload);
      yield put(actions.loadFilteredOrdersCompleted(orders));
    }
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.loadFilteredOrdersFailed(message));
  }
}

function* executeSubscribeSaga({ sockets }: IDependencies, { payload }: NS.ISubscribe) {

  const channel = eventChannel<IServerOrder[]>(emitter => {
    openOrdersLogger.log('[executeSubscribeSaga] try to subscribe', payload);
    subscriber.subscribe(sockets, payload, emitter);
    return () => {
      openOrdersLogger.log('[executeSubscribeSaga] try to unsubscribe from', payload);
      subscriber.unsubscribe(sockets, payload);
    };
  });

  try {
    while (true) {
      const { cancel, task }: { cancel?: NS.IUnsubscribe, task?: IServerOrder[] } = yield race({
        task: take(channel),
        cancel: take(unsubscribeType),
      });

      if (cancel) {
        openOrdersLogger.log('[executeSubscribeSaga] in while true in cancel condition,', cancel);
        channel.close();
        break;
      }

      if (task) {
        yield put(actions.applyActiveOrdersDiff(task.map(convertToActiveOrder)));
        openOrdersLogger.log('[executeSubscribeSaga] in while true,', task);
        const archive = R.reject<IServerOrder>((x) => x.isPending)(task);
        if (archive.length) {
          openOrdersLogger.log('[executeSubscribeSaga] in while true in archive condition,', archive);
          yield put(actions.applyArchiveOrdersDiff(archive.map(convertToArchiveOrder)));
        }
      }

    }
  } catch (e) {
    openOrdersLogger.log('[executeSubscribeSaga] subscribe failed', e);
  } finally {
    openOrdersLogger.log('[executeSubscribeSaga] in finally close');
    channel.close();
  }
}

export default getSaga;
