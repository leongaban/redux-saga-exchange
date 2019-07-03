import { makeReduxFormEntry } from 'shared/helpers/redux';
import * as NS from '../../namespace';

export const verificationFormEntry = makeReduxFormEntry<NS.IVerificationCodeForm>('verification-code',
  ['code']);
