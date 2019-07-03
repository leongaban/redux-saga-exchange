import { put, takeEvery, race, take, all } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import SocketSubscriber from 'services/sockets/SocketSubscriber';
import { IDependencies } from 'shared/types/app';
import { envLogger } from 'shared/helpers/debug';
import { ITransfer } from 'shared/types/models';
import { convertTransfers } from 'shared/helpers/converters';

import * as actions from '../actions';
import * as NS from '../../namespace';

const subscriber: SocketSubscriber = new SocketSubscriber();
const transfersLogger = envLogger(__filename, 'transfers');

const subscribeType: NS.ISubscribe['type'] = 'OPERATION_HISTORY:SUBSCRIBE';
const unsubscribeType: NS.IUnsubscribe['type'] = 'OPERATION_HISTORY:UNSUBSCRIBE';

function getSaga(deps: IDependencies) {
  function* saga() {
    yield all([
      takeEvery(subscribeType, executeSubscribeSaga, deps),
    ]);
  }

  return saga;
}

function* executeSubscribeSaga({ sockets }: IDependencies, { payload }: NS.ISubscribe) {

  const channel = eventChannel<ITransfer[]>(emitter => {
    transfersLogger.log('[executeSubscribeSaga] try to subscribe', payload);
    subscriber.subscribe(sockets, payload, emitter);
    return () => {
      transfersLogger.log('[executeSubscribeSaga] try to unsubscribe from', payload);
      subscriber.unsubscribe(sockets, payload);
    };
  });

  try {
    while (true) {
      const { cancel, task }: { cancel?: NS.IUnsubscribe, task?: ITransfer[] } = yield race({
        task: take(channel),
        cancel: take(unsubscribeType),
      });

      if (cancel) {
        transfersLogger.log('[executeSubscribeSaga] in while true in cancel condition,', cancel);
        channel.close();
        break;
      }

      if (task) {
        yield put(actions.applyDiff(convertTransfers(task)));
        transfersLogger.log('[executeSubscribeSaga] in while true,', task);
      }

    }
  } catch (e) {
    console.error('[executeSubscribeSaga] subscribe failed', e);
  } finally {
    transfersLogger.log('[executeSubscribeSaga] in finally close');
    channel.close();
  }
}

export default getSaga;
