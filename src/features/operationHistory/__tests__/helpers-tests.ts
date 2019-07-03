import uuid from 'uuid';
import * as R from 'ramda';

import moment from 'services/moment';
import { IOperation } from 'shared/types/models';
import { operationMock } from 'shared/mocks';
import { makeDescendDateSortChecker } from 'shared/helpers/test';

import { applyOperationHistoryDiff } from '../helpers';

describe('applyOperationHistoryDiff helper', () => {
  test('Apply new uniq (by id) operation', () => {
    expect(
      applyOperationHistoryDiff([operationMock], [{ ...operationMock, id: uuid() }])
    ).toHaveLength(2);
  });

  test('Apply not uniq (by id) operation', () => {
    const result = applyOperationHistoryDiff([operationMock], [{ ...operationMock, amount: operationMock.amount + 1 }]);
    expect(result).toHaveLength(1);
    expect(result[0].amount).toEqual(operationMock.amount + 1);
  });

  test('Should be descend sorted by creationDate', () => {
    const diffOperations: IOperation[] = R.range(0, 10).map(x => {
      return {
        ...operationMock,
        id: uuid(),
        creationDate: moment(operationMock.creationDate).add((Math.random() * 10).toFixed(0), 'd').toISOString(),
      };
    });
    const result = applyOperationHistoryDiff([], diffOperations);
    const descendDateSortChecker = makeDescendDateSortChecker<IOperation>('creationDate');
    const isSortedCorrectly = result.every(descendDateSortChecker);
    expect(isSortedCorrectly).toBe(true);
  });
});
