import * as NS from '../namespace';
import { initialCommunicationField } from 'shared/helpers/redux';

export const initial: NS.IReduxState = {
  communication: {
    getTioLockedBalance: initialCommunicationField,
    getLPAssets: initialCommunicationField,
    setUseLiquidityPool: initialCommunicationField,
    getUseLiquidityPool: initialCommunicationField,
    makePayout: initialCommunicationField,
    postLoanAgreement: initialCommunicationField
  },
  data: {
    assets: [],
    lastPayoutTs: '',
    pandaDocId: '',
    poolTotalTio: 0,
    timeValid: false,
    tioLocked: 0,
    totalTio: 0,
    useLiquidityPool: false,
  },
  edit: {
    assetFilter: '',
    conversionCurrency: 'usdt',
  },
};
