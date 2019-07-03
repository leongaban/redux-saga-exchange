import { put, call, all, takeLatest } from 'redux-saga/effects';

import { IDependencies } from 'shared/types/app';

import * as actions from '../actions';
import { IPaginatedData, ITransaction } from 'shared/types/models';
import getErrorMsg from 'shared/helpers/getErrorMsg';

import * as NS from '../../namespace';

const loadTransactionsType: NS.ILoadTransactions['type'] = 'TRANSACTIONS:LOAD_TRANSACTIONS';

function getSaga(deps: IDependencies) {
  return function* saga() {
    yield all([
      takeLatest(loadTransactionsType, executeLoadTransactions, deps),
    ]);
  };
}

function* executeLoadTransactions({ api }: IDependencies, { payload }: NS.ILoadTransactions) {
  try {
    const response: IPaginatedData<ITransaction[]> = yield call(api.users.loadTransactions, payload);
    yield put(actions.loadTransactionsSuccess(response));
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.loadTransactionsFail(message));
  }
}

export { getSaga };
