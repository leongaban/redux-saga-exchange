import { initialCommunicationField } from 'shared/helpers/redux';
import { IReduxState } from '../../namespace';

export const initial: IReduxState = {
  communication: {
    load: initialCommunicationField,
    updateMarket: initialCommunicationField,
  },
  data: {
    markets: [],
  },
  edit: {
    currentMarket: null,
  },
  ui: {
    isEditMarketModalShown: false,
  },
};
