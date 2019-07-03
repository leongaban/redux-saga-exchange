import { SagaIterator } from 'redux-saga';
import { all } from 'redux-saga/effects';

import { IDependencies } from 'shared/types/app';

function getSaga(deps: IDependencies) {
  return function* saga(): SagaIterator {
    yield all([
    ]);
  };
}

export { getSaga };
