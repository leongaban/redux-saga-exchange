import * as NS from '../../namespace';
import { makeCommunicationActionCreators } from 'shared/helpers/redux';

export const {
  execute: sendCodeToEmail,
  completed: sendCodeToEmailSuccess,
  failed: sendCodeToEmailFail,
} = makeCommunicationActionCreators<NS.ISendCodeToEmail, NS.ISendCodeToEmailSuccess, NS.ISendCodeToEmailFail>(
  'TWO_FA_PROVIDER:SEND_CODE_TO_EMAIL',
  'TWO_FA_PROVIDER:SEND_CODE_TO_EMAIL_SUCCESS',
  'TWO_FA_PROVIDER:SEND_CODE_TO_EMAIL_FAIL',
);

export const {
  execute: sendVerificationCode,
  completed: sendVerificationCodeSuccess,
  failed: sendVerificationCodeFail,
} = makeCommunicationActionCreators<
  NS.ISendVerificationCode,
  NS.ISendVerificationCodeSuccess,
  NS.ISendVerificationCodeFail
>(
  'TWO_FA_PROVIDER:SEND_VERIFICATION_CODE',
  'TWO_FA_PROVIDER:SEND_VERIFICATION_CODE_SUCCESS',
  'TWO_FA_PROVIDER:SEND_VERIFICATION_CODE_FAIL',
);

export const {
  execute: loadSecretInfo,
  completed: loadSecretInfoSuccess,
  failed: loadSecretInfoFail,
} = makeCommunicationActionCreators<NS.ILoadSecretInfo, NS.ILoadSecretInfoSuccess, NS.ILoadSecretInfoFail>(
  'TWO_FA_PROVIDER:LOAD_SECRET_INFO',
  'TWO_FA_PROVIDER:LOAD_SECRET_INFO_SUCCESS',
  'TWO_FA_PROVIDER:LOAD_SECRET_INFO_FAIL',
);

export const {
  execute: disable2FA,
  completed: disable2FASuccess,
  failed: disable2FAFail,
} = makeCommunicationActionCreators<NS.IDisable2FA, NS.IDisable2FASuccess, NS.IDisable2FAFail>(
  'TWO_FA_PROVIDER:DISABLE_2FA',
  'TWO_FA_PROVIDER:DISABLE_2FA_SUCCESS',
  'TWO_FA_PROVIDER:DISABLE_2FA_FAIL',
);
