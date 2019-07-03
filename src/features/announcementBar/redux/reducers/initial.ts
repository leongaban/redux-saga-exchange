import { IReduxState } from '../../namespace';
import { initialCommunicationField } from 'shared/helpers/redux';

export const initial: IReduxState = {
  data: {
    items: [],
  },
  communication: {
    loadingAnnouncements: initialCommunicationField
  }
};
