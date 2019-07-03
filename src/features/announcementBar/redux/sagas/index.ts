import { put, takeEvery, call, all } from 'redux-saga/effects';

import { annoucementsDefaultType as type } from 'shared/constants';
import { IDependencies } from 'shared/types/app';
import * as actions from '../actions';
import { ILoad } from '../../namespace';

function getSaga(deps: IDependencies) {
  const loadType: ILoad['type'] = 'ANNOUNCEMENT:LOAD';

  return function* saga() {
    yield all([
      takeEvery(loadType, executeLoad, deps),
    ]);
  };
}

function* executeLoad({ api }: IDependencies) {
  try {
    const items = yield call(api.announcements.loadFrontOfficeAnnouncements, type);
    yield put(actions.loadAnnouncementsSuccess(items));
  } catch (error) {
    yield put(actions.loadAnnouncementsFail(error));
  }
}

export { getSaga };
