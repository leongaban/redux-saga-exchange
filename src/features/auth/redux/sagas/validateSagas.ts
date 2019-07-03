import { IDependencies } from 'shared/types/app';
import { call, put, takeLatest, all } from 'redux-saga/effects';

import getErrorMsg from 'shared/helpers/getErrorMsg';
import { IValidationInfo } from 'shared/types/models';

import * as actions from '../actions';
import * as NS from '../../namespace';

const validateNicknameType: NS.IValidateNickname['type'] = 'AUTH:VALIDATE_NICKNAME';

function* validateSaga(deps: IDependencies) {
  yield all([
    takeLatest(validateNicknameType, executeValidateNickname, deps),
  ]);
}

function* executeValidateNickname({ api }: IDependencies, { payload }: NS.IValidateNickname) {
  try {
    const result: IValidationInfo = yield call(api.auth.validateNickname, payload.value);
    if (result.isFree) {
      payload.onValidationSuccess();
    } else {
      payload.onValidationFail();
    }
    yield put(actions.validateNicknameSuccess());
  } catch (error) {
    payload.onValidationFail();
    yield put(actions.validateNicknameFail(getErrorMsg(error)));
  }
}

export default validateSaga;
