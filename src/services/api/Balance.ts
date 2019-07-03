import { bind } from 'decko';

import BaseApi from './Base';
import * as NS from './types';
import { IWithdrawCoinsRequest, IHoldingProvider, IVerifyWithdrawCoinsRequest } from 'shared/types/requests';
import { IDepositAddressData } from 'shared/types/models';

class BalanceApi extends BaseApi {

  @bind
  public async loadDepositAddress(asset: string): Promise<IDepositAddressData> {
    const params: NS.IWalletAddressRequest = { assetId: asset };
    const response = await this.actions.post<NS.IGetDepositAddressResponse>(
      '/frontoffice/api/wallet/deposit',
      params,
    );
    return response.data;
  }

  @bind
  public async withdrawCoins(
    request: IWithdrawCoinsRequest | IVerifyWithdrawCoinsRequest,
    code?: string,
  ): Promise<IHoldingProvider | void> {
    const response = await this.actions.post<IHoldingProvider | void>('/frontoffice/api/wallet/withdrawal', {
      ...request,
      code: code ? code : undefined,
    });
    return response.data;
  }
}

export default BalanceApi;
