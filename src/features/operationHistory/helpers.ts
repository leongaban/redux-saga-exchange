import * as R from 'ramda';

import { IOperation } from 'shared/types/models';
import { sortArray } from 'shared/helpers/sort';

export function applyOperationHistoryDiff(
  currentOperations: IOperation[], operationsDiff: IOperation[],
): IOperation[] {
  const updatedOperations = operationsDiff.reduce((curr, diff) => {
    const matchIndex = curr.findIndex(x => diff.id === x.id);
    return matchIndex !== -1 ? R.update(matchIndex, diff, curr) : R.append(diff, curr);
  }, currentOperations);
  return sortArray(updatedOperations, {
    column: 'creationDate',
    direction: 'descend',
    kind: 'date',
  });
}
