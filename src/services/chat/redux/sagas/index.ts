import { call, put, takeEvery, all } from 'redux-saga/effects';

import { IDependencies } from 'shared/types/app';
import getErrorMsg from 'shared/helpers/getErrorMsg';

import * as NS from '../../namespace';
import * as actions from '../actions';

const openChannelType: NS.IOpenChannel['type'] = 'CHAT:OPEN_CHANNEL';
const closeChannelType: NS.ICloseChannel['type'] = 'CHAT:CLOSE_CHANNEL';

export default function getSaga(deps: IDependencies) {

  function* saga() {
    yield all([
      takeEvery(openChannelType, executeOpenChannel, deps),
      takeEvery(closeChannelType, executeCloseChannel, deps),
    ]);
  }

  return saga;
}

export function* executeOpenChannel(deps: IDependencies, action: NS.IOpenChannel) {
  try {
    yield call(deps.sockets.enterChannel, 'chat.' + action.payload);
    yield put(actions.openChannelSuccess());
  } catch (error) {
    yield put(actions.openChannelFailed(getErrorMsg(error)));
  }
}

export function* executeCloseChannel(deps: IDependencies, action: NS.ICloseChannel) {
  try {
    yield call(deps.sockets.leaveChannel, 'chat.' + action.payload);
    yield put(actions.closeChannelSuccess());
  } catch (error) {
    yield put(actions.closeChannelFailed(getErrorMsg(error)));
  }
}
