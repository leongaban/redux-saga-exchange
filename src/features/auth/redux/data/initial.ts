import { initialCommunicationField } from 'shared/helpers/redux';
import { IReduxState } from '../../namespace';

const initialState: IReduxState = {
  communications: {
    login: initialCommunicationField,
    register: initialCommunicationField,
    resetPassword: initialCommunicationField,
    changePassword: initialCommunicationField,
    logout: initialCommunicationField,
    confirmEmail: initialCommunicationField,
    sendTwoFactorVerificationData: initialCommunicationField,
    validateNickname: initialCommunicationField,
  },
  data: {
    twoFactorInfo: {
      isRequired: false,
      provider: 'Email',
    },
  },
  edit: {
    timerValue: 10,
    isTimerStarted: false,
    isTokenInvalid: false,
  },
};

export default initialState;
