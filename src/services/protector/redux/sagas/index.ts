import { put, take, select, race, takeLatest, all } from 'redux-saga/effects';
import { stopSubmit, change } from 'redux-form';

import { IDependencies } from 'shared/types/app';
import { IHoldingProvider } from 'shared/types/requests';

import * as actions from '../actions';
import * as selectors from '../data/selectors';
import * as reduxFormEntries from '../data/reduxFormEntries';
import { getApiError } from 'shared/helpers/getErrorMsg';
import * as NS from '../../namespace';

const terminateVerificationType: NS.ITerminateVerification['type'] = 'PROTECTOR:TERMINATE_VERIFICATION';
const verifyType: NS.IVerify['type'] = 'PROTECTOR:VERIFY';

const { verificationFormEntry: {
  name: verificationFormName,
  fieldNames: verificationCodeFields,
} } = reduxFormEntries;

interface IProtectionParams {
  expectsProvider: boolean;
  conditionalProtection: boolean;
}

export default function getSaga(deps: IDependencies) {
  const setCodeFieldValueType: NS.ISetCodeFieldValue['type'] = 'PROTECTOR:SET_CODE_FIELD_VALUE';

  function* saga() {
    yield all([
      takeLatest(setCodeFieldValueType, executeSetCodeFieldValue, deps),
    ]);
  }

  return saga;
}

export function* executeSetCodeFieldValue(deps: IDependencies, action: NS.ISetCodeFieldValue) {
  const { verificationFormEntry } = reduxFormEntries;
  yield put(change(verificationFormEntry.name, verificationFormEntry.fieldNames.code, action.payload));
}

const defaultParams: IProtectionParams = {
  expectsProvider: true,
  conditionalProtection: false,
};

// TODO refactor this
export function protect(actionSaga: NS.IProtectedSaga, params?: Partial<IProtectionParams>) {
  const { expectsProvider, conditionalProtection } = params ? { ...defaultParams, ...params } : defaultParams;

  return function* inner(deps: IDependencies, ...args: any[]) {

    if (!conditionalProtection && !expectsProvider) {
      yield innerInner(deps, ...args);

    } else if (!conditionalProtection && expectsProvider) {
      const result: IHoldingProvider | void = yield actionSaga(deps, ...args);
      if (!result) {
        return;
      }
      yield put(actions.setProvider(result.provider));
      yield innerInner(deps, ...args);

    } else if (conditionalProtection && !expectsProvider) {
      const maybeBreak: 'break' | void = yield actionSaga(deps, ...args);
      if (maybeBreak !== 'break') {
        yield innerInner(deps, ...args);
      }

    } else if (conditionalProtection && expectsProvider) {
      const result: 'break' | IHoldingProvider | void = yield actionSaga(deps, ...args);
      if (result && result !== 'break') {
        yield put(actions.setProvider(result.provider));
        yield innerInner(deps, ...args);
      }
    }
  };

  function* innerInner(deps: IDependencies, ...args: any[]) {
    yield put(actions.toggleVerificationModalState());

    while (true) {
      try {
        const { cancel, task }: { cancel?: NS.ITerminateVerification, task?: NS.IVerify } =
          yield race({
            task: take(verifyType),
            cancel: take(terminateVerificationType),
          });

        if (cancel || !task) {
          yield put(actions.toggleVerificationModalState());
          return;
        }

        yield actionSaga(deps, ...args, task.payload);
        yield put(actions.toggleVerificationModalState());
        yield put(actions.verifySuccess());
        break;
      } catch (error) {
        const invalidCodeError = getApiError(error)((x) => x === 'invalid_authentication_code');
        if (invalidCodeError) {
          const retries: number = yield select(selectors.selectRetriesAmount);
          const maxNumberOfRetries: number = yield select(selectors.selectMaxNumberOfRetries);
          if (retries === maxNumberOfRetries) {
            yield put(actions.toggleVerificationModalState());
          } else {
            yield put(stopSubmit(verificationFormName, {
              [verificationCodeFields.code]: 'Incorrect authentication code',
            }));
            yield put(actions.setRetriesAmount(retries + 1));
          }
        } else {
          yield put(actions.toggleVerificationModalState());
        }
        yield put(actions.verifyFail(error.message));
      }
    }
  }
}
