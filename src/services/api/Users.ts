import { bind } from 'decko';

import { ILoadUsersRequest } from 'shared/types/requests/users';
import {
  IAdminPanelUser, IServerAdminUsersResponse, IUserRole, IPaginatedData, ICurrencyBalance,
  IDocuments, IServerDocument, ITransaction, IServerPagedResponse, ILoadTransactionsRequest, IBalanceDict, IUser,
} from 'shared/types/models';
import { ILoadUserBalanceResponse } from './types';
import BaseApi from './Base';

import {
  convertUsersArrayToAdminPanelUsers,
  convertRequestUserToAdminPanelUser,
  convertUserToRequest,
  convertToServerLoadUsersRequest,
  convertUserBalance,
  convertUserBalanceToBalanceDict,
} from './converters';
import { convertDocumentsList } from 'shared/helpers/converters';
import { convertPagingRequest, convertPaginatedData } from './converters/helpers';

export default class UsersApi extends BaseApi {

  @bind
  public async load(request: ILoadUsersRequest): Promise<IPaginatedData<IAdminPanelUser[]>> {
    const params = convertToServerLoadUsersRequest(request);
    const response = await this.actions.get<IServerAdminUsersResponse>(`/back-api/backoffice/users`, params);
    const data = convertUsersArrayToAdminPanelUsers(response.data.data);
    return convertPaginatedData(data, response.data.paging);
  }

  @bind
  public async loadTransactions(
    request: ILoadTransactionsRequest,
  ): Promise<IPaginatedData<ITransaction[]>> {
    const response = await this.actions.get<IServerPagedResponse<ITransaction[]>>(
      `/back-api/backoffice/user/${request.userID}/transfers`,
      { ...convertPagingRequest(request), ...request.filters },
    );
    return convertPaginatedData(response.data.data, response.data.paging);
  }

  @bind
  public async loadUserRoles(): Promise<IUserRole[]> {
    const response = await this.actions.get<{ data: IUserRole[] }>(`/back-api/backoffice/roles`);
    return response.data.data;
  }

  @bind
  public async loadUserProfile(userId: string): Promise<IUser> {
    const response = await this.actions.get<{ data: IUser }>(`/back-api/backoffice/user/${userId}`);
    return response.data.data;
  }

  @bind
  public async updateUserProfile(profile: IAdminPanelUser): Promise<void> {
    await this.actions.put(`/back-api/backoffice/user/${profile.id}`, convertUserToRequest(profile), {}, {});
  }

  @bind
  public async removeRole(userId: string, role: string): Promise<void> {
    await this.actions.del(`/back-api/backoffice/user/${userId}/role/${role}`, {}, {}, {});
  }

  @bind
  public async addRole(userId: string, role: string): Promise<void> {
    await this.actions.post(`/back-api/backoffice/user/${userId}/role/${role}`);
  }

  @bind
  public async enable2FA(userId: string): Promise<void> {
    await this.actions.put(`/back-api/backoffice/user/${userId}/2fa/enable`, {}, {}, {});
  }

  @bind
  public async disable2FA(userId: string): Promise<void> {
    await this.actions.put(`/back-api/backoffice/user/${userId}/2fa/disable`, {}, {}, {});
  }

  @bind
  public async unlockUser(userId: string): Promise<void> {
    await this.actions.put(`/back-api/backoffice/user/${userId}/unlock`, {}, {}, {});
  }

  @bind
  public async confirmEmail(userId: string): Promise<void> {
    await this.actions.put(`/back-api/backoffice/user/${userId}/confirm-email`, {}, {}, {});
  }

  @bind
  public async deleteUserClaim(userId: string, claimId: number): Promise<void> {
    await this.actions.del(`/back-api/backoffice/user/${userId}/claims/${claimId}`, {}, {}, {});
  }

  @bind
  public async verify(userId: string): Promise<void> {
    await this.actions.put(`/back-api/backoffice/user/${userId}/verify`, {}, {}, {});
  }

  @bind
  public async unverify(userId: string): Promise<void> {
    await this.actions.put(`/back-api/backoffice/user/${userId}/unverify`, {}, {}, {});
  }

  @bind
  public async loadCurrentUser(userId: string): Promise<IAdminPanelUser> {
    const response = await this.actions.get<any>(`/backoffice/user/${userId}`);
    return convertRequestUserToAdminPanelUser(response.data.data);
  }

  @bind
  public async activateUser(userId: string): Promise<void> {
    await this.actions.put(`/back-api/backoffice/user/${userId}/unblock`, {}, {}, {});
  }

  @bind
  public async deactivateUser(userId: string): Promise<void> {
    await this.actions.put(`/back-api/backoffice/user/${userId}/block`, {}, {}, {});
  }

  @bind
  public async loadUserBalance(userId: string): Promise<ICurrencyBalance[]> {
    const response = await this.actions.get<ILoadUserBalanceResponse>(`/back-api/backoffice/user/${userId}/assets`);
    const userBalance = response.data.data;
    return convertUserBalance(userBalance);
  }

  @bind
  public async loadCurrentUserBalances(): Promise<IBalanceDict> {
    const response = await this.actions.get<ILoadUserBalanceResponse>(`/frontoffice/api/assets`);
    return convertUserBalanceToBalanceDict(response.data.data);
  }

  @bind
  public async resetKycDocument(userId: string, documentId: string): Promise<void> {
    await this.actions.put<void>(
      `back-api/backoffice/user/${userId}/resetkyc?uniqueFileName=${documentId}`
      , {}, {}, {});
    return;
  }

  @bind
  public async getUserDocuments(userId: string): Promise<IDocuments> {
    const documentsResponse = await this.actions.get<
      { data: IServerDocument[] }
      >(`back-api/backoffice/user/${userId}/documents`);
    const documents = convertDocumentsList(documentsResponse.data.data);
    return documents;
  }
}
