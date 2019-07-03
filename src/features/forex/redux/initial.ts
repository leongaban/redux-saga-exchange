import * as NS from '../namespace';
import { initialCommunicationField } from 'shared/helpers/redux';

export const initial: NS.IReduxState = {
  communication: {
    getUseForex: initialCommunicationField,
    setUseForex: initialCommunicationField,
    getForexBalance: initialCommunicationField,
    createForexAccount: initialCommunicationField,
    depositIntoMT5: initialCommunicationField,
    withdrawFromMT5: initialCommunicationField,
  },
  data: {
    asset: 'none',
    balance: 0,
    callingGetBalance: false,
    credit: 0,
    equity: 0,
    exchangeRate: 0,
    floating: 0,
    freeMargin: 0,
    leverage: 0,
    profit: 0,
    mt5LoginId: 0,
    message: '',
    margin: 0,
    marginLevel: 0,
    useForex: false,
    userAmountWithdrawn: 0,
    userBalance: 1000,
  }
};
