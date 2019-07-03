import { IChangePasswordInfo, IRegisterInfo, ILoginInfo } from 'shared/types/models';
import {
  IRegisterResponse, ILoginResponse, IResetPasswordResponse,
  IChangePasswordRequest
} from '../types';

export function convertRegisterResponse(response: IRegisterResponse): IRegisterInfo {
  return {
    email: response.account.email,
    nickname: response.account.nickname,
    id: response.account.nickname,
    affiliateId: response.account.affiliateid,
  };
}

export function convertLoginResponse(response: ILoginResponse): ILoginInfo {
  return {
    message: response.message,
    secondFactorRequired: response.secondFactorRequired,
    provider: response.provider,
  };
}

export function convertResetPasswordResponse(response: IResetPasswordResponse) {
  return {
    message: response.meta.message,
  };
}

export function convertResetPasswordRequest(info: IChangePasswordInfo): IChangePasswordRequest {
  return {
    account: {
      password: info.password,
    },
    resetPasswordToken: info.resetPasswordToken,
  };
}
