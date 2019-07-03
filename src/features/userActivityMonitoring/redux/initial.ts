import * as NS from '../namespace';
import { initialCommunicationField } from 'shared/helpers/redux';

export const initial: NS.IReduxState = {
  communication: {
    setLastActivity: initialCommunicationField,
  },
  edit: {
    isUserActivityCheckingStart: false,
    lastServerActivity: null,
  },
  ui: {
    isModalSessionExpirationOpen: false,
  },
};
