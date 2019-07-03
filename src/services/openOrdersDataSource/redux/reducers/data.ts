import * as NS from '../../namespace';
import { initial } from '../data/initial';
import { applyActiveOrdersDiff } from '../helpers';

export function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'OPEN_ORDERS_DATA_SOURCE:LOAD_ARCHIVE_OF_ORDERS_COMPLETED':
    case 'OPEN_ORDERS_DATA_SOURCE:APPLY_ARCHIVE_ORDERS_DIFF': {
      return {
        ...state,
        archive: [
          ...state.archive,
          ...action.payload,
        ],
      };
    }
    case 'OPEN_ORDERS_DATA_SOURCE:APPLY_ACTIVE_ORDERS_DIFF': {
      return {
        ...state,
        active: applyActiveOrdersDiff(state.active, action.payload),
      };
    }
    case 'OPEN_ORDERS_DATA_SOURCE:LOAD_FILTERED_ORDERS_COMPLETED': {
      return {
        ...state,
        reportArchive: action.payload.data,
      };
    }
    default: return state;
  }
}
