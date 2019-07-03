import { IDependencies } from 'shared/types/app';
import { SagaIterator } from 'redux-saga';
import { all } from 'redux-saga/effects';

function getSaga(deps: IDependencies): () => SagaIterator {
  return function* saga(): SagaIterator {
    yield all([
    ]);
  };
}

export default getSaga;
