import { initialCommunicationField } from 'shared/helpers/redux';
import { paginatedTableDefaultState } from 'shared/constants';
import { IReduxState } from '../../namespace';

export const initial: IReduxState = {
  communication: {
    cancelOrder: initialCommunicationField,
    cancelAllOrders: initialCommunicationField,
  },
  edit: { // TODO make currentOrder in initial state null
    currentOrder: {
      type: 'buy',
      market: '',
      fullVolume: 0,
      limitPrice: 0,
      filledVolume: 0,
      filledPercent: 0,
      remainingVolume: 0,
      remainingPercent: 0,
      orderType: 'Limit',
      id: 0,
      datePlaced: '',
    },
  },
  ui: {
    cancelModalState: {
      isOpen: false,
      id: 0
    },
    activeOrdersTable: paginatedTableDefaultState,
    orderHistoryTable: paginatedTableDefaultState,
    areCanceledOrdersHidden: false,
  },
};
