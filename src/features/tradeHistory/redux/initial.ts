import * as NS from '../namespace';
import { initialCommunicationField } from 'shared/helpers/redux';

export const initial: NS.IReduxState = {
  communication: {
    load: initialCommunicationField,
  },
  data: {
    trades: [],
    extendedTrades: [],
  },
  edit: {
    extendedTradesTotalPages: 1,
  },
};
