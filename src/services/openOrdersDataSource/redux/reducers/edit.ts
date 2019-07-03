import * as NS from '../../namespace';
import { initial } from '../data/initial';

export function editReducer(state: NS.IReduxState['edit'] = initial.edit, action: NS.Action): NS.IReduxState['edit'] {
  switch (action.type) {
    case 'OPEN_ORDERS_DATA_SOURCE:SET_REPORT_ARCHIVE_TOTAL_PAGES':
      return {
        ...state,
        reportArchiveTotalPages: action.payload,
      };
    default: return state;
  }
}
