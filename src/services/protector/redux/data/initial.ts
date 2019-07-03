import * as NS from '../../namespace';
import { initialCommunicationField } from 'shared/helpers/redux';

const initial: NS.IReduxState = {
  edit: {
    retries: 1,
    provider: 'Email',
  },
  ui: {
    isVerificationModalOpen: false,
  },
  communications: {
    verify: initialCommunicationField,
  },
};

export default initial;
