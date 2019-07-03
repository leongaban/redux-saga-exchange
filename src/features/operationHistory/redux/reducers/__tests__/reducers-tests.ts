import { operationMock } from 'shared/mocks';

import { dataReducer } from '../data';
import { initial } from '../../data/initial';
import * as NS from '../../../namespace';

describe('(reducer) data', () => {
  it('should handle OPERATION_HISTORY:APPLY_DIFF', () => {
    const dataState = dataReducer(
      initial.data,
      { type: 'OPERATION_HISTORY:APPLY_DIFF', payload: [operationMock] },
    );
    const updatedState: NS.IReduxState['data'] = {
      ...initial.data,
      operations: [operationMock],
    };
    expect(dataState).toEqual(updatedState);
  });
});
