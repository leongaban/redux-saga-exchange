import { IReduxState } from '../../namespace';
import { initialCommunicationField } from 'shared/helpers/redux';

export const initial: IReduxState = {
  data: {
    items: [],
    warning: false,
    isSaved: false,
    modalIndex: null
  },
  communication: {
    loadingAnnouncements: initialCommunicationField,
    savingAnnouncements: initialCommunicationField
  }
};
