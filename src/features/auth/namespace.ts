import { IAction, ICommunication, IPlainAction, IPlainFailAction } from 'shared/types/redux';
import {
  IChangePasswordInfo, IConfirmEmailInfo, ITwoFactorInfo, ITwoFactorVerificationData, IRegisterCredentials,
} from 'shared/types/models';

export interface IReduxState {
  communications: {
    login: ICommunication;
    register: ICommunication;
    resetPassword: ICommunication;
    changePassword: ICommunication;
    logout: ICommunication;
    confirmEmail: ICommunication;
    sendTwoFactorVerificationData: ICommunication;
    validateNickname: ICommunication;
  };
  data: {
    twoFactorInfo: ITwoFactorInfo;
  };
  edit: {
    timerValue: number;
    isTimerStarted: boolean;
    isTokenInvalid: boolean;
  };
}

type ICaptchaValue = string | null;

export interface ILoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export interface ILoginPayload extends ILoginForm {
  isAdminPanel: boolean;
}

export interface IRegisterPayload extends IRegisterCredentials {
  queryStringForUtm: string;
  captcha: ICaptchaValue;
}

export interface IRegistrationForm {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  referralId: string;
  captcha: ICaptchaValue;
}

export interface IPasswordRecoveryForm {
  email: string;
  captcha: ICaptchaValue;
}

export interface IChangePasswordForm {
  password: string;
  passwordConfirm: string;
}

export interface ITwoFactorForm {
  code: string;
}

export interface IValidatePayload {
  value: string;
  onValidationSuccess(): void;
  onValidationFail(): void;
}

export type ILogin = IAction<'AUTH:LOGIN', ILoginPayload>;
export type ILoginSuccess = IPlainAction<'AUTH:LOGIN_SUCCESS'>;
export type ILoginFail = IPlainFailAction<'AUTH:LOGIN_FAIL'>;

export type ILogout = IAction<'AUTH:LOGOUT', boolean | undefined>;
export type ILogoutSuccess = IPlainAction<'AUTH:LOGOUT_SUCCESS'>;
export type ILogoutFail = IPlainFailAction<'AUTH:LOGOUT_FAIL'>;

export type IRegister = IAction<'AUTH:REGISTER', IRegisterPayload>;
export type IRegisterSuccess = IPlainAction<'AUTH:REGISTER_SUCCESS'>;
export type IRegisterFail = IPlainFailAction<'AUTH:REGISTER_FAIL'>;

export type IResetPassword = IAction<'AUTH:RESET_PASSWORD', IPasswordRecoveryForm>;
export type IResetPasswordSuccess = IPlainAction<'AUTH:RESET_PASSWORD_SUCCESS'>;
export type IResetPasswordFail = IPlainFailAction<'AUTH:RESET_PASSWORD_FAIL'>;

export type IChangePassword = IAction<'AUTH:CHANGE_PASSWORD', IChangePasswordInfo>;
export type IChangePasswordSuccess = IPlainAction<'AUTH:CHANGE_PASSWORD_SUCCESS'>;
export type IChangePasswordFail = IPlainFailAction<'AUTH:CHANGE_PASSWORD_FAIL'>;

export type IConfirmEmail = IAction<'AUTH:CONFIRM_EMAIL', IConfirmEmailInfo>;
export type IConfirmEmailSuccess = IPlainAction<'AUTH:CONFIRM_EMAIL_SUCCESS'>;
export type IConfirmEmailFail = IPlainFailAction<'AUTH:CONFIRM_EMAIL_FAIL'>;

export type IResendConfirmationEmail = IAction<'AUTH:RESEND_CONFIRMATION_EMAIL', string>;
export type IResendConfirmationEmailSuccess = IPlainAction<'AUTH:RESEND_CONFIRMATION_EMAIL_SUCCESS'>;
export type IResendConfirmationEmailFail = IPlainFailAction<'AUTH:RESEND_CONFIRMATION_EMAIL_FAIL'>;

export type ISetIsInvalidToken = IAction<'AUTH:SET_IS_TOKEN_INVALID', boolean>;
export type ISetTwoFactorInfo = IAction<'AUTH:SET_TWO_FACTOR_INFO', ITwoFactorInfo>;

export type ISendTwoFactorVerificationData = IAction<'AUTH:SEND_TWO_FACTOR_DATA', ITwoFactorVerificationData>;
export type ISendTwoFactorVerificationDataSuccess = IPlainAction<'AUTH:SEND_TWO_FACTOR_DATA_SUCCESS'>;
export type ISendTwoFactorVerificationDataFail = IPlainFailAction<'AUTH:SEND_TWO_FACTOR_DATA_FAIL'>;

export type IStartTimer = IAction<'AUTH:START_TIMER', number>;
export type IStopTimer = IPlainAction<'AUTH:STOP_TIMER'>;
export type ISetTimerValue = IAction<'AUTH:SET_TIMER_VALUE', number>;

export type IValidateNickname = IAction<'AUTH:VALIDATE_NICKNAME', IValidatePayload>;
export type IValidateNicknameSuccess = IPlainAction<'AUTH:VALIDATE_NICKNAME_SUCCESS'>;
export type IValidateNicknameFail = IPlainFailAction<'AUTH:VALIDATE_NICKNAME_FAIL'>;

export type Action = ILogin | ILoginSuccess | ILoginFail | IRegister | IRegisterSuccess | IRegisterFail
  | IChangePassword | IChangePasswordSuccess | IChangePasswordFail | IResetPassword | IResetPasswordSuccess
  | IResetPasswordFail | ILogout | ILogoutSuccess | ILogoutFail
  | IStartTimer | IStopTimer | ISetTimerValue | IConfirmEmail | IConfirmEmailSuccess | IConfirmEmailFail
  | IResendConfirmationEmail | IResendConfirmationEmailSuccess | IResendConfirmationEmailFail
  | IValidateNickname | IValidateNicknameSuccess | IValidateNicknameFail
  | ISetIsInvalidToken | ISetTwoFactorInfo;
