import { put, takeLatest, call, select, all } from 'redux-saga/effects';
import * as R from 'ramda';
import { stopSubmit, arrayPush, arrayRemove } from 'redux-form';

import { selectors as userSelectors, actions as userActions } from 'services/user';
import { actions as notificationActions } from 'services/notification';
import getErrorMsg, { isApiError, getApiError, getNicknameError } from 'shared/helpers/getErrorMsg';
import { IUser, ISingleDocument } from 'shared/types/models';
import { IDependencies } from 'shared/types/app';

import * as actions from '../actions';
import * as reduxFormEntries from '../reduxFormEntries';
import * as NS from '../../namespace';

const {
  personalDataFormEntry: { name: personalDataFormName, fieldNames: personalDataFormFields },
} = reduxFormEntries;

function getSaga(deps: IDependencies) {
  const savePersonalInfoType: NS.ISavePersonalInfo['type'] = 'PROFILE:SAVE_PERSONAL_INFO';
  const uploadDocumentType: NS.IUploadDocument['type'] = 'PROFILE:UPLOAD_DOCUMENT';
  const removeDocumentType: NS.IRemoveDocument['type'] = 'PROFILE:REMOVE_DOCUMENT';
  const uploadImageType: NS.IUploadImage['type'] = 'PROFILE:UPLOAD_IMAGE';

  return function* saga() {
    yield all([
      takeLatest(uploadImageType, executeUploadImage, deps),
      takeLatest(uploadDocumentType, executeUploadDocument, deps),
      takeLatest(removeDocumentType, executeRemoveDocument, deps),
      takeLatest(savePersonalInfoType, executeSavePersonalInfo, deps),
    ]);
  };
}

function* executeSavePersonalInfo({ api }: IDependencies, { payload }: NS.ISavePersonalInfo) {
  try {
    yield call(
      api.profile.savePersonalInfo,
      payload,
    );
    yield put(userActions.updateData({
      nickname: payload.nickname,
      firstName: payload.firstName,
      middleName: payload.middleName,
      lastName: payload.lastName,
      country: payload.country,
    }));
    yield put(actions.savePersonalInfoSuccess());
    yield put(notificationActions.setNotification({ kind: 'info', text: 'Profile successfully saved' }));
  } catch (err) {
    const getError = getApiError(err);
    const error = isApiError(err) ? getError(R.T) : getErrorMsg(err);
    const nicknameError = isApiError(err) ? getNicknameError(err, payload.nickname) : '';
    yield put(stopSubmit(personalDataFormName, {
      _error: error,
      nickname: nicknameError,
    }));
    yield put(notificationActions.setNotification({ kind: 'error', text: nicknameError ? nicknameError : error }));
    yield put(actions.savePersonalInfoFail(error));
  }
}

function* executeUploadDocument({ api }: IDependencies, { payload }: NS.IUploadDocument) {
  try {
    const user: IUser | null = yield select(userSelectors.selectUser);
    if (!user) {
      console.error('User does not exist while upload document');
      return;
    }
    const { file, type } = payload;
    const document: ISingleDocument = yield call(
      api.profile.uploadDocument,
      file,
      type,
      (progress: number) => api.dispatch(actions.setUploadProgress(progress)),
    );
    yield put(arrayPush(personalDataFormName, `${personalDataFormFields.documents}.${type}`, document));
    yield put(actions.uploadDocumentSuccess());
  } catch (error) {
    const errorMsg = isApiError(error) ? getApiError(error)(R.T) : getErrorMsg(error);
    yield put(notificationActions.setNotification({ kind: 'error', text: errorMsg }));
    yield put(actions.uploadDocumentFail(errorMsg));
  }
}

function* executeUploadImage({ api }: IDependencies, { payload }: NS.IUploadImage) {
  try {
    const imageUrl: string = yield call(
      api.profile.uploadImage,
      payload,
      (progress: number) => api.dispatch(actions.setUploadProgress(progress)),
    );
    yield put(userActions.updateData({
      avatarUrl: imageUrl,
    }));
    yield put(actions.uploadImageSuccess());
  } catch (error) {
    const errorMsg = isApiError(error) ? getApiError(error)(R.T) : getErrorMsg(error);
    yield put(notificationActions.setNotification({ kind: 'error', text: errorMsg }));
    yield put(actions.uploadImageFail(errorMsg));
  }
}

function* executeRemoveDocument({ api }: IDependencies, { payload }: NS.IRemoveDocument) {
  try {
    const { index, id, type } = payload;
    const user: IUser | null = yield select(userSelectors.selectUser);
    if (!user) {
      console.error('User does not exist while upload document');
      return;
    }
    yield call(
      api.profile.removeDocument,
      id,
    );
    yield put(arrayRemove(personalDataFormName, `${personalDataFormFields.documents}.${type}`, index));
    yield put(actions.removeDocumentSuccess());
  } catch (error) {
    const errorMsg = isApiError(error) ? getApiError(error)(R.T) : getErrorMsg(error);
    yield put(notificationActions.setNotification({ kind: 'error', text: errorMsg }));
    yield put(actions.removeDocumentFail(errorMsg));
  }
}

export { getSaga };
