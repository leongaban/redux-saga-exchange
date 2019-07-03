import { initialCommunicationField } from 'shared/helpers/redux';

import * as NS from '../namespace';

export const initial: NS.IReduxState = {
  communication: {
    loadDepositAddress: initialCommunicationField,
    withdrawCoins: initialCommunicationField,
    withdrawCoinsVerify: initialCommunicationField,
  },
  ui: {
    modals: {
      depositCoins: {
        isOpen: false,
        currencyCode: null,
        address: null,
      },
      withdrawCoins: {
        isOpen: false,
        currencyCode: null,
      },
      simplex: {
        isOpen: false,
        address: null,
        currency: '',
      }
    },
  },
};
