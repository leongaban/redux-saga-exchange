import { IAdminPanelUser, IServerAdminUser, ICurrencyBalance, IBalanceDict } from 'shared/types/models';
import { ILoadUsersRequest } from 'shared/types/requests';
import { IServerLoadUsersRequest, IServerCurrencyBalance } from '../types';

export function convertUsersArrayToAdminPanelUsers(response: IServerAdminUser[]): IAdminPanelUser[] {
  return response.map(convertRequestUserToAdminPanelUser);
}

export function convertRequestUserToAdminPanelUser(user: IServerAdminUser): IAdminPanelUser {
  return {
    nickname: user.nickname,
    email: user.email,
    firstName: user.first_name,
    middleName: user.middle_name,
    lastName: user.last_name,
    country: user.country,
    roles: user.roles || [],
    isVerified: user.is_verified,
    isEmailConfirmed: user.is_email_confirmed,
    isActive: user.is_active,
    dateCreated: user.date_created,
    id: user.id,
    avatarUrl: user.image_url,
    canDeposit: user.can_deposit,
    canWithdraw: user.can_withdraw,
    isPhoneConfirmed: user.is_phone_confirmed,
    twoFactorEnabled: user.two_factor_enabled,
    lockoutEnd: user.lockout_end || '',
    claims: user.claims || [],
    accountType: user.account_type,
    affiliateId: user.affiliate_id,
    referralId: user.referral_id,
  };
}

export function convertUserToRequest(user: IAdminPanelUser) {
  return {
    email: user.email,
    first_name: user.firstName,
    middle_name: user.middleName,
    last_name: user.lastName,
    country_id: user.country ? user.country.id : undefined,
    user_name: user.nickname,
  };
}

export function convertToServerLoadUsersRequest(request: ILoadUsersRequest): IServerLoadUsersRequest {
  return {
    Page: request.page,
    PerPage: request.perPage,
    Search: request.search,
    Type: request.filter,
  };
}

export function convertUserBalance(currencyBalances: IServerCurrencyBalance[]): ICurrencyBalance[] {
  return currencyBalances.map((x: IServerCurrencyBalance) => ({ code: x.asset, value: x.balance }));
}

export function convertUserBalanceToBalanceDict(currencyBalances: IServerCurrencyBalance[]): IBalanceDict {
  return currencyBalances.reduce((prev, curr) => {
    return { ...prev, [curr.asset]: curr.balance };
  }, {});
}
