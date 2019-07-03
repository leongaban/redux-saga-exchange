import { bind } from 'decko';
import BaseApi from './Base';

import {
  ICreateForexAccountRequest,
  ICreateForexAccountResponse,
  IGetForexBalanceResponse,
  IGetForexBalanceData,
  IWithdrawForexRequest,
  IWithdrawForexResponse,
} from 'shared/types/requests/forex';
import { convertBalanceData } from 'services/api/converters/forex';

class ForexApi extends BaseApi {
  @bind
  public async getUseForex(): Promise<boolean> {
    const response = await this.actions.get<{ data: { useForex: boolean } }>('/frontoffice/api/settings');
    return response.data.data && response.data.data.useForex;
  }

  @bind
  public async setUseForex(value: boolean): Promise<number> {
    const response = await this.actions.put('/frontoffice/api/setting', {
      type: 'use-forex',
      value,
    }, {}, {});
    return response.status;
  }

  @bind
  public async getForexBalance(): Promise<IGetForexBalanceData> {
    const response = await this.actions.get<IGetForexBalanceResponse>('/frontoffice/mt5/balance');
    const data = convertBalanceData(response.data);
    return data;
  }

  @bind
  public async createForexAccount(request: ICreateForexAccountRequest):
    Promise<ICreateForexAccountResponse> {
      const response =
        await this.actions.post<ICreateForexAccountResponse>('/frontoffice/mt5/user', {
          name: request.name,
          address: request.address,
          leverage: request.leverage,
          group: request.baseAsset
        });
      const { data } = response;
      return data;
    }

  @bind
  public async withdrawFromMT5(request: IWithdrawForexRequest):
  Promise<IWithdrawForexResponse> {
      const response =
        await this.actions.post<IWithdrawForexResponse>('/frontoffice/mt5/withdrawal', {
          amount: request.amount
        });
      const { data } = response;
      return data;
    }
}

export default ForexApi;
