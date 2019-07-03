import { IDependencies } from 'shared/types/app';
import { put, takeEvery, race, take, all } from 'redux-saga/effects';
import * as actions from '../actions';
import * as NS from '../../namespace';
import { eventChannel } from 'redux-saga';
import { envLogger } from 'shared/helpers/debug';
import SocketSubscriber from 'services/sockets/SocketSubscriber';
import { convertExchangeRates } from 'shared/helpers/converters';
import { IInstrumentInfo } from 'shared/types/models';

const subscriber: SocketSubscriber = new SocketSubscriber();
const minitickerLogger = envLogger(__filename, 'miniticker');

const subscribeType: NS.ISubscribe['type'] = 'MINITICKER_DATA_SOURCE:SUBSCRIBE';
const unsubscribeType: NS.IUnsubscribe['type'] = 'MINITICKER_DATA_SOURCE:UNSUBSCRIBE';

function getSaga(deps: IDependencies) {
  function* saga() {
    yield all([
      takeEvery(subscribeType, executeSubscribeSaga, deps),
    ]);
  }

  return saga;
}

function* executeSubscribeSaga({ sockets }: IDependencies, { payload }: NS.ISubscribe) {

  const channel = eventChannel<IInstrumentInfo[]>(emitter => {
    minitickerLogger.log('[executeSubscribeSaga] try to subscribe', payload);
    subscriber.subscribe(sockets, payload, emitter);
    return () => {
      minitickerLogger.log('[executeSubscribeSaga] try to unsubscribe from', payload);
      subscriber.unsubscribe(sockets, payload);
    };
  });

  try {
    while (true) {
      const { cancel, task }: { cancel?: NS.IUnsubscribe, task?: IInstrumentInfo[] } = yield race({
        task: take(channel),
        cancel: take(unsubscribeType),
      });

      if (cancel) {
        minitickerLogger.log('[executeSubscribeSaga] in while true in cancel condition,', cancel);
        channel.close();
        break;
      }

      if (task) {
        yield put(actions.applyDiff(convertExchangeRates(task)));
        minitickerLogger.log('[executeSubscribeSaga] in while true,', task);
      }

    }
  } catch (e) {
    minitickerLogger.log('[executeSubscribeSaga] subscribe failed', e);
  } finally {
    minitickerLogger.log('[executeSubscribeSaga] in finally close');
    channel.close();
  }
}

export default getSaga;
