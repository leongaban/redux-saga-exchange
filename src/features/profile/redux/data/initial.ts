import * as NS from '../../namespace';
import { initialCommunicationField } from 'shared/helpers/redux';

export const initial: NS.IReduxState = {
  communication: {
    savePersonalInfo: initialCommunicationField,
    uploadDocument: initialCommunicationField,
    removeDocument: initialCommunicationField,
    uploadImage: initialCommunicationField,
  },
  edit: {
    uploadProgress: 0,
  },
  ui: {
    croppAvatarModalState: {
      isOpen: false,
    },
  },
};
