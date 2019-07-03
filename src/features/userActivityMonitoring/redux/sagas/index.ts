import { Moment } from 'moment';
import { delay } from 'redux-saga';
import { call, put, takeLatest, takeEvery, select, all } from 'redux-saga/effects';

import { IDependencies } from 'shared/types/app';
import getErrorMsg from 'shared/helpers/getErrorMsg';
import moment from 'services/moment';
import { timeBeforeSessionExpirationWarning, timeBeforeWeShouldKeepServerAlive } from 'shared/constants';

import * as actions from '../actions';
import * as NS from '../../namespace';
import * as selectors from '../selectors';

function getSaga(deps: IDependencies) {
  const setLastActivityType: NS.ISetLastActivity['type'] = 'USER_ACTIVITY_MONITORING:SET_LAST_ACTIVITY';
  const startUserActivityChecking: NS.IStartUserActivityChecking['type'] =
    'USER_ACTIVITY_MONITORING:START_USER_ACTIVITY_CHECKING';

  return function* saga() {
    yield all([
      takeEvery(setLastActivityType, executeSetLastActivity, deps),
      takeLatest(startUserActivityChecking, executeStartUserActivityChecking, deps),
    ]);
  };
}

function* executeSetLastActivity({ api }: IDependencies, { payload }: NS.ISetLastActivity) {
  try {
    yield call(api.storage.setLastActiveTime, payload);
    const lastSeverActivity: number | null = yield select(selectors.selectLastServerActivity);
    if (lastSeverActivity === null) {
      yield put(actions.setLastServerActivity(+payload));
    } else {
      const shouldKeepAlive = (+payload - lastSeverActivity) > timeBeforeWeShouldKeepServerAlive * 1000;
      if (shouldKeepAlive) {
        yield call(api.auth.keepAlive);
        yield put(actions.setLastServerActivity(+payload));
      }
    }
    yield put(actions.setLastActivityCompleted());
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.setLastActivityFailed(message));
  }
}

function* executeStartUserActivityChecking({ api }: IDependencies) {
  yield put(actions.toggleUserActivityChecking(true));
  while (yield select(selectors.selectIsUserActivityCheckingStart)) {
    const currentTime = Number(moment());
    const isModalSessionExpirationOpen = yield select(selectors.selectIsModalSessionExpirationOpen);

    const response: Moment = yield call(api.storage.getLastActiveTime);
    const lastUserActivityTime = Number(response);
    const isUserActive = (currentTime - lastUserActivityTime) < timeBeforeSessionExpirationWarning * 1000;
    if (!isUserActive && !isModalSessionExpirationOpen) {
      yield put(actions.toggleModalSessionExpirationState(true));
    }
    yield call(delay, 5000);
  }
}

export { getSaga };
