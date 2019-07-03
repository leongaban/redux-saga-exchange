import { initialCommunicationField } from 'shared/helpers/redux';
import * as NS from '../../namespace';

export const initial: NS.IReduxState = {
  communication: {
    loadFilteredOrders: initialCommunicationField,
  },
  edit: {
    reportArchiveTotalPages: 1,
  },
  data: {
    active: [],
    archive: [],
    reportArchive: [],
  },
};
