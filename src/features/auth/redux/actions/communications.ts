import { makeCommunicationActionCreators } from 'shared/helpers/redux';

import * as NS from './../../namespace';

export const { execute: login, completed: loginSuccess, failed: loginFail } =
  makeCommunicationActionCreators<NS.ILogin, NS.ILoginSuccess, NS.ILoginFail>(
    'AUTH:LOGIN',
    'AUTH:LOGIN_SUCCESS',
    'AUTH:LOGIN_FAIL',
  );

export const { execute: register, completed: registerSuccess, failed: registerFail } =
  makeCommunicationActionCreators<NS.IRegister, NS.IRegisterSuccess, NS.IRegisterFail>(
    'AUTH:REGISTER',
    'AUTH:REGISTER_SUCCESS',
    'AUTH:REGISTER_FAIL',
  );

export const { execute: resetPassword, completed: resetPasswordSuccess, failed: resetPasswordFail } =
  makeCommunicationActionCreators<NS.IResetPassword, NS.IResetPasswordSuccess, NS.IResetPasswordFail>(
    'AUTH:RESET_PASSWORD',
    'AUTH:RESET_PASSWORD_SUCCESS',
    'AUTH:RESET_PASSWORD_FAIL',
  );

export const { execute: changePassword, completed: changePasswordSuccess, failed: changePasswordFail } =
  makeCommunicationActionCreators<NS.IChangePassword, NS.IChangePasswordSuccess, NS.IChangePasswordFail>(
    'AUTH:CHANGE_PASSWORD',
    'AUTH:CHANGE_PASSWORD_SUCCESS',
    'AUTH:CHANGE_PASSWORD_FAIL',
  );

export const { execute: logout, completed: logoutSuccess, failed: logoutFail } =
  makeCommunicationActionCreators<NS.ILogout, NS.ILogoutSuccess, NS.ILogoutFail>(
    'AUTH:LOGOUT',
    'AUTH:LOGOUT_SUCCESS',
    'AUTH:LOGOUT_FAIL',
  );

export const { execute: confirmEmail, completed: confirmEmailSuccess, failed: confirmEmailFail } =
  makeCommunicationActionCreators<NS.IConfirmEmail, NS.IConfirmEmailSuccess, NS.IConfirmEmailFail>(
    'AUTH:CONFIRM_EMAIL',
    'AUTH:CONFIRM_EMAIL_SUCCESS',
    'AUTH:CONFIRM_EMAIL_FAIL',
  );
/* tslint:disable:max-line-length */
export const { execute: resendConfirmationEmail, completed: resendConfirmationEmailSuccess, failed: resendConfirmationEmailFail } =
  makeCommunicationActionCreators<NS.IResendConfirmationEmail, NS.IResendConfirmationEmailSuccess, NS.IResendConfirmationEmailFail>(
    'AUTH:RESEND_CONFIRMATION_EMAIL',
    'AUTH:RESEND_CONFIRMATION_EMAIL_SUCCESS',
    'AUTH:RESEND_CONFIRMATION_EMAIL_FAIL',
  );

export const { execute: sendTwoFactorData, completed: sendTwoFactorDataSuccess, failed: sendTwoFactorDataFail } =
  makeCommunicationActionCreators<NS.ISendTwoFactorVerificationData, NS.ISendTwoFactorVerificationDataSuccess, NS.ISendTwoFactorVerificationDataFail>(
    'AUTH:SEND_TWO_FACTOR_DATA',
    'AUTH:SEND_TWO_FACTOR_DATA_SUCCESS',
    'AUTH:SEND_TWO_FACTOR_DATA_FAIL',
  );

export const { execute: validateNickname, completed: validateNicknameSuccess, failed: validateNicknameFail } =
  makeCommunicationActionCreators<NS.IValidateNickname, NS.IValidateNicknameSuccess, NS.IValidateNicknameFail>(
    'AUTH:VALIDATE_NICKNAME', 'AUTH:VALIDATE_NICKNAME_SUCCESS', 'AUTH:VALIDATE_NICKNAME_FAIL',
  );
