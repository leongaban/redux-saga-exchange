import { bind } from 'decko';
import * as converters from './converters';
import * as NS from './types';
import BaseApi from './Base';
import {
  IRegisterCredentials, ILoginCredentials,
  IRegisterInfo, IChangePasswordInfo, IConfirmEmailInfo,
  IRestoreSessionResponse, ITwoFactorVerificationData, ILoginInfo, IValidationInfo,
} from 'shared/types/models';

class AuthApi extends BaseApi {

  @bind
  public async register(
    credentials: IRegisterCredentials,
    queryStringForUtm?: string,
    recaptcha?: string,
  ): Promise<IRegisterInfo> {
    const headers = {
      'queryString': queryStringForUtm,
      'g-recaptcha-response': recaptcha,
    };
    const response = await this.actions.post<NS.IRegisterResponse>('/frontoffice/api/profile', {
      account: {
        nickname: credentials.nickname,
        email: credentials.email,
        password: credentials.password,
        referalId: credentials.referralId ? credentials.referralId : '',
      },
    }, {
        headers,
      });
    return converters.convertRegisterResponse(response.data);
  }

  @bind
  public async login(credentials: ILoginCredentials): Promise<ILoginInfo> {
    const response = await this.actions.post<NS.ILoginResponse>('/frontoffice/api/sign-in', credentials);
    return converters.convertLoginResponse(response.data);
  }

  @bind
  public async loginToAdminPanel(credentials: ILoginCredentials): Promise<ILoginInfo> {
    const response = await this.actions.post<NS.ILoginResponse>('/back-api/backoffice/sign-in', credentials);
    return converters.convertLoginResponse(response.data);
  }

  @bind
  public async twoFactorVerify(twoFactorData: ITwoFactorVerificationData): Promise<void> {
    await this.actions.post('/frontoffice/api/sign-in', {
      verificationCode: twoFactorData.code,
      provider: twoFactorData.provider,
    });
  }

  @bind
  public async logout(): Promise<void> {
    await this.actions.post('/frontoffice/api/sign-out');
  }

  @bind
  public async logoutFromAdminPanel(): Promise<void> {
    await this.actions.post('/back-api/backoffice/sign-out');
  }

  @bind
  public async resetPassword(email: string): Promise<void> {
    await this.actions.post('/frontoffice/api/profile/reset-password', { email });
  }

  @bind
  public async changePassword(changePasswordInfo: IChangePasswordInfo): Promise<void> {
    await this.actions.post('/frontoffice/api/profile/password', {
      account: {
        password: changePasswordInfo.password,
        email: changePasswordInfo.email,
      },
      resetPasswordToken: changePasswordInfo.resetPasswordToken,
    });
  }

  @bind
  public async confirmEmail({ email, token }: IConfirmEmailInfo): Promise<void> {
    await this.actions.post('/frontoffice/api/profile/confirm-email', {
      email,
      token,
    });
  }

  @bind
  public async resendConfirmationEmail(email: string): Promise<void> {
    await this.actions.post('/frontoffice/api/profile/resend-confirmation-email', { email });
  }

  @bind
  public async restoreAdminSession(): Promise<string> {
    const response = await this.actions.get<IRestoreSessionResponse>('/back-api/backoffice/user/profile');
    return response.data.account.userId;
  }

  @bind
  public async validateNickname(nickname: string): Promise<IValidationInfo> {
    const response = await this.actions.post<IValidationInfo>('/frontoffice/api/profile/validate-user', {
      user: nickname,
    });
    return response.data;
  }

  @bind
  public async keepAlive(): Promise<void> {
    await this.actions.post<void>('/frontoffice/api/keep-alive');
  }

}

export default AuthApi;
