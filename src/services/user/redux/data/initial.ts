import * as NS from '../../namespace';
import { initialCommunicationField } from 'shared/helpers/redux';

const initial: NS.IReduxState = {
  data: {
    isAuthorized: false,
    isAdminAuthorized: false,
    isVerified: false,
    user: null,
    balances: {},
  },
  communications: {
    sessionRestoring: initialCommunicationField,
    loadBalances: initialCommunicationField,
    restoreAdminSession: initialCommunicationField,
    fetchDocuments: initialCommunicationField,
    getDocument: initialCommunicationField,
  },
};

export default initial;
