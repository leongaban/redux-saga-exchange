import * as NS from '../namespace';
import { initialCommunicationField } from 'shared/helpers/redux';

export const initial: NS.IReduxState = {
  communication: {
    sendCodeToEmail: initialCommunicationField,
    sendVerificationCode: initialCommunicationField,
    loadSecretInfo: initialCommunicationField,
    disabe2FA: initialCommunicationField,
  },
  data: {
    secretInfo: null,
  },
  ui: {
    isShowVerificationForm: false,
  },
};
