import { initialCommunicationField } from 'shared/helpers/redux';
import { defaultPaginationState } from 'shared/constants';
import * as NS from '../../namespace';

export const initial: NS.IReduxState = {
  communication: {
    loadTransactions: initialCommunicationField,
  },
  data: {
    transactions: {
      data: [],
      pagination: defaultPaginationState,
    },
  },
};
