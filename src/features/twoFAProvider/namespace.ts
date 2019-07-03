import { IPlainAction, IPlainFailAction, ICommunication, IAction } from 'shared/types/redux';
import { ISecretInfo } from 'shared/types/models';

export interface IReduxState {
  communication: {
    sendCodeToEmail: ICommunication;
    sendVerificationCode: ICommunication;
    loadSecretInfo: ICommunication;
    disabe2FA: ICommunication;
  };
  data: {
    secretInfo: ISecretInfo | null;
  };
  ui: {
    isShowVerificationForm: boolean;
  };
}

export interface IToggle2faForm {
  code: string;
  new2FaProviderCode: string;
}

export type IToggleCodeFormVisibility = IAction<'TWO_FA_PROVIDER:TOGGLE_Code_FORM_VISIBILITY', boolean>;

export type ILoadSecretInfo = IPlainAction<'TWO_FA_PROVIDER:LOAD_SECRET_INFO'>;
export type ILoadSecretInfoSuccess = IAction<'TWO_FA_PROVIDER:LOAD_SECRET_INFO_SUCCESS', ISecretInfo>;
export type ILoadSecretInfoFail = IPlainFailAction<'TWO_FA_PROVIDER:LOAD_SECRET_INFO_FAIL'>;

export type ISendCodeToEmail = IPlainAction<'TWO_FA_PROVIDER:SEND_CODE_TO_EMAIL'>;
export type ISendCodeToEmailSuccess = IPlainAction<'TWO_FA_PROVIDER:SEND_CODE_TO_EMAIL_SUCCESS'>;
export type ISendCodeToEmailFail = IPlainFailAction<'TWO_FA_PROVIDER:SEND_CODE_TO_EMAIL_FAIL'>;

export type ISendVerificationCode = IAction<'TWO_FA_PROVIDER:SEND_VERIFICATION_CODE', IToggle2faForm>;
export type ISendVerificationCodeSuccess = IAction<'TWO_FA_PROVIDER:SEND_VERIFICATION_CODE_SUCCESS', ISecretInfo>;
export type ISendVerificationCodeFail = IPlainFailAction<'TWO_FA_PROVIDER:SEND_VERIFICATION_CODE_FAIL'>;

export type IDisable2FA = IPlainFailAction<'TWO_FA_PROVIDER:DISABLE_2FA'>;
export type IDisable2FASuccess = IAction<'TWO_FA_PROVIDER:DISABLE_2FA_SUCCESS', ISecretInfo>;
export type IDisable2FAFail = IPlainFailAction<'TWO_FA_PROVIDER:DISABLE_2FA_FAIL'>;

export type Action =
  | ILoadSecretInfo
  | ILoadSecretInfoSuccess
  | ILoadSecretInfoFail
  | ISendCodeToEmail
  | ISendCodeToEmailSuccess
  | ISendCodeToEmailFail
  | ISendVerificationCode
  | ISendVerificationCodeSuccess
  | ISendVerificationCodeFail
  | IDisable2FA
  | IDisable2FASuccess
  | IDisable2FAFail
  | IToggleCodeFormVisibility;
