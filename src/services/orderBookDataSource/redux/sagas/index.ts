import { IDependencies } from 'shared/types/app';
import { put, takeEvery, race, take, all } from 'redux-saga/effects';
import * as actions from '../actions';
import * as NS from '../../namespace';
import { eventChannel } from 'redux-saga';
import { envLogger } from 'shared/helpers/debug';
import SocketSubscriber from 'services/sockets/SocketSubscriber';
import { convertOrderBookDiff } from 'shared/helpers/converters';
import { IServerOrderBookDiff } from 'shared/types/models';

const subscriber: SocketSubscriber = new SocketSubscriber();
const bookLogger = envLogger(__filename, 'book');

const subscribeType: NS.ISubscribe['type'] = 'ORDER_BOOK_DATA_SOURCE:SUBSCRIBE';
const unsubscribeType: NS.IUnsubscribe['type'] = 'ORDER_BOOK_DATA_SOURCE:UNSUBSCRIBE';

function getSaga(deps: IDependencies) {
  function* saga() {
    yield all([
      takeEvery(subscribeType, executeSubscribeSaga, deps),
    ]);
  }

  return saga;
}

function* executeSubscribeSaga({ sockets }: IDependencies, { payload }: NS.ISubscribe) {

  const channel = eventChannel<IServerOrderBookDiff>(emitter => {
    bookLogger.log('[executeSubscribeSaga] try to subscribe', payload);
    subscriber.subscribe(sockets, payload, emitter);
    return () => {
      bookLogger.log('[executeSubscribeSaga] try to unsubscribe from', payload);
      subscriber.unsubscribe(sockets, payload);
    };
  });

  try {
    while (true) {
      const { cancel, task }: { cancel?: NS.IUnsubscribe, task?: IServerOrderBookDiff } = yield race({
        task: take(channel),
        cancel: take(unsubscribeType),
      });

      if (cancel) {
        bookLogger.log('[executeSubscribeSaga] in while true in cancel condition,', cancel);
        channel.close();
        break;
      }

      if (task) {
        yield put(actions.applyDiff(convertOrderBookDiff(task)));
        bookLogger.log('[executeSubscribeSaga] in while true,', task);
      }

    }
  } catch (e) {
    bookLogger.log('[executeSubscribeSaga] subscribe failed', e);
  } finally {
    bookLogger.log('[executeSubscribeSaga] in finally close');
    channel.close();
  }
}

export default getSaga;
