import { bind } from 'decko';

import BaseApi from './Base';
import {
  IGetTioLockedBalanceResponse,
  IGetLPAssetsResponse,
  ILPAssetsResponse,
  ILoanAgreementRes,
} from 'shared/types/models/liquidityPool';
import { IMakePayoutRequest, IPandaDocsRequest } from 'shared/types/requests';
import { convertLPAssetsResponse } from 'shared/helpers/converters/liquidityPool';

class LiquidityPoolApi extends BaseApi {
  @bind
  public async getTioLockedBalance(userId: string): Promise<number | string> {
    const response = await this.actions.get<IGetTioLockedBalanceResponse>(
      '/frontoffice/liquidity-pool/balances'
    );
    const { data } = response;

    if (data && data.data && data.data.tio_locked) {
      return data.data.tio_locked;
    }

    return 0;
  }

  // This for for real live data once API is ready.
  @bind
  public async getLPAssets(userId: string): Promise<ILPAssetsResponse> {
    const response = await this.actions.get<IGetLPAssetsResponse>(
      '/frontoffice/liquidity-pool/assets'
    );
    const { data } = response.data;

    if (data === void 0) {
      // If user is not in LP, return defaults:
      return {
        poolTotalTio: 0,
        lastPayoutTs: 'No last payout',
        timeValid: true,
        assets: []
      };
    } else {
      const poolTotalTio = (data.pool_total_tio > 0) ? data.pool_total_tio : 0;
      const lastPayoutTs = (data.last_payout_timestamp) ? data.last_payout_timestamp : 'No last payout';
      const timeValid = data.time_valid;

      // If user has assets, convert assets:
      if (data.assets && data.assets.length > 0) {
        return convertLPAssetsResponse(data);
      }

      return {
        poolTotalTio,
        lastPayoutTs,
        timeValid,
        assets: []
      };
    }
  }

  @bind
  public async setUseLiquidityPool(value: boolean): Promise<void> {
    await this.actions.put('/frontoffice/api/setting', {
      type: 'use-liquidity-pool',
      value,
    }, {}, {});
  }

  @bind
  public async getUseLiquidityPool(): Promise<boolean> {
    const response = await this.actions.get<{ data: { useLiquidityPool: boolean } }>('/frontoffice/api/settings');
    return response.data.data && response.data.data.useLiquidityPool;
  }

  @bind
  public async makePayout(request: IMakePayoutRequest): Promise<void> {
    await this.actions.post('/frontoffice/liquidity-pool/unlock', {
      paymentSystem: request.paymentSystem,
      assetId: request.assetId,
      amount: request.amount,
    });
  }

  @bind
  public async getTotalTio(): Promise<number> {
    const response = await this.actions.get<{ total_tio: number }>('/frontoffice/liquidity-pool/global-tiox');
    const { data } = response;
    return data && data.total_tio;
  }

  @bind
  public async postLoanAgreement(request: IPandaDocsRequest): Promise<ILoanAgreementRes> {
    const response = await this.actions.post<ILoanAgreementRes>('/frontoffice/liquidity-pool/loan-agreement', {
      first_name: request.firstName,
      last_name: request.lastName,
      email: request.email,
      amount_tio_locked: request.amount,
      address: request.address
    });

    const { data } = response;
    return data;
  }
}

export default LiquidityPoolApi;
