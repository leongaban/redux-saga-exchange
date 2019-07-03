import * as NS from '../../namespace';
import { initial } from '../data/initial';

function uiReducer(state: NS.IReduxState['ui'] = initial.ui, action: NS.Action): NS.IReduxState['ui'] {
  switch (action.type) {
    case 'ORDERS:SET_IS_CANCEL_MODAL_OPEN': {
      return {
        ...state,
        cancelModalState: {
          isOpen: action.payload.isOpen,
          id: action.payload.id
        }
      };
    }

    case 'ORDERS:SET_ACTIVE_ORDERS_TABLE': {
      return {
        ...state,
        activeOrdersTable: {
          ...state.activeOrdersTable,
          ...action.payload,
        }
      };
    }

    case 'ORDERS:SET_ORDER_HISTORY_TABLE': {
      return {
        ...state,
        orderHistoryTable: {
          ...state.orderHistoryTable,
          ...action.payload,
        }
      };
    }

    case 'ORDERS:SET_ARE_CANCELED_ORDERS_HIDDEN': {
      return {
        ...state,
        areCanceledOrdersHidden: action.payload,
      };
    }

    default: return state;
  }
}

export default uiReducer;
