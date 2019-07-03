import * as NS from '../../namespace';
import { initial } from '../data/initial';
import { applyOperationHistoryDiff } from '../../helpers';

export function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'OPERATION_HISTORY:APPLY_DIFF': {
      return {
        ...state,
        operations: applyOperationHistoryDiff(state.operations, action.payload),
      };
    }
    default: return state;
  }
}
