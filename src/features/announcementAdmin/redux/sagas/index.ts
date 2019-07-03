import { put, takeEvery, call, all, select } from 'redux-saga/effects';

import { annoucementsDefaultType as type } from 'shared/constants';
import { IDependencies } from 'shared/types/app';
import * as actions from '../actions';
import * as selectors from '../data/selectors';

// for now we are loading only one type of annoucement, it will be extended later on

function getSaga(deps: IDependencies) {
  return function* saga() {
    yield all([
      takeEvery('ANNOUNCEMENT_ADMIN:LOAD', executeLoad, deps),
      takeEvery('ANNOUNCEMENT_ADMIN:SAVE', executeSave, deps),
    ]);
  };
}

function* executeLoad({ api }: IDependencies) {
  try {
    const data = yield call(api.announcements.loadAnnouncements, type);
    yield put(actions.loadAnnouncementsSuccess(data));
  } catch (error) {
    yield put(actions.loadAnnouncementsFail(error));
  }
}

function* executeSave({ api }: IDependencies) {
  try {
    const items = yield select(selectors.selectAnnoucements);
    const data = yield call(api.announcements.saveAnnouncements, items, type);
    yield put(actions.saveAnnouncementsSuccess(data));
  } catch (error) {
    yield put(actions.saveAnnouncementsFail(error));
  }
}

export { getSaga };
