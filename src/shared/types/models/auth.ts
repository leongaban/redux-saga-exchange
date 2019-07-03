import { TwoFAType } from '.';

export interface IRegisterCredentials {
  email: string;
  password: string;
  nickname: string;
  referralId: string;
}

export interface IRegisterInfo {
  email: string;
  id: string;
  nickname: string;
  affiliateId: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
  isPersistance: boolean;
}

export interface ILoginInfo {
  message: string;
  secondFactorRequired: boolean;
  provider: TwoFAType;
}

export interface IChangePasswordInfo {
  password: string;
  email?: string;
  resetPasswordToken?: string;
}

export interface IConfirmEmailInfo {
  email?: string;
  token?: string;
}

export interface IRestoreSessionResponse {
  account: {
    nickname: string;
    email: string;
    userId: string;
  };
  basicVerification: {
    completed: boolean;
    dateOfBirth: string;
    inReview: boolean;
  };
}

export interface ITwoFactorInfo {
  isRequired: boolean;
  provider: TwoFAType;
}

export interface ITwoFactorVerificationData {
  code: string;
  provider: TwoFAType;
}

export interface IValidationInfo {
  isFree: boolean;
  isValid: boolean;
}
