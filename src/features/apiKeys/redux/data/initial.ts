import { initialCommunicationField } from 'shared/helpers/redux';

import * as NS from '../../namespace';

export const initial: NS.IReduxState = {
  communication: {
    getApiKeys: initialCommunicationField,
    addApiKey: initialCommunicationField,
    removeApiKey: initialCommunicationField,
  },
  data: {
    apiKeys: [],
  }
};
