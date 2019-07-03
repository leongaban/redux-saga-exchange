import { call, put, takeEvery, all } from 'redux-saga/effects';

import { IDependencies } from 'shared/types/app';
import getErrorMsg from 'shared/helpers/getErrorMsg';

import * as actions from '../actions';
import * as NS from '../../namespace';

export function* executeOpenChannel(deps: IDependencies, action: NS.IOpenChanel) {
  try {
    yield call(deps.sockets.enterChannel, action.payload);
    yield put(actions.openChannelCompleted());
  } catch (error) {
    console.error(error);
    yield put(actions.openChannelFailed(getErrorMsg(error)));
  }
}

export function* executeCloseChannel(deps: IDependencies, action: NS.ICloseChanel) {
  try {
    yield call(deps.sockets.leaveChannel, action.payload);
    yield put(actions.closeChannelCompleted());
  } catch (error) {
    console.error(error);
    yield put(actions.closeChannelFailed(getErrorMsg(error)));
  }
}

function getSaga(deps: IDependencies) {
  const openChannelType: NS.IOpenChanel['type'] = 'SOCKETS:OPEN_CHANNEL';
  const closeChannelType: NS.ICloseChanel['type'] = 'SOCKETS:CLOSE_CHANEL';

  function* saga() {
    yield all([
      takeEvery(openChannelType, executeOpenChannel, deps),
      takeEvery(closeChannelType, executeCloseChannel, deps),
    ]);
  }

  return saga;
}

export default getSaga;
