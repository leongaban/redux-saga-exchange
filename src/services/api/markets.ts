import { bind } from 'decko';

import { IMarket, IEditMarketInfo } from 'shared/types/models';
import { TradeioApiResponseInfoResponse } from 'shared/types/frontoffice_server';

import BaseApi from './Base';
import { converMarketsResponse, converMarketRequest } from './converters/';

export default class MarketsApi extends BaseApi {

  @bind
  public async loadMarkets(): Promise<IMarket[]> {
    const marketsResponse = await this.actions.get<TradeioApiResponseInfoResponse>('/frontoffice/api/info');
    return converMarketsResponse(marketsResponse.data);
  }

  @bind
  public async editMarket(market: IEditMarketInfo): Promise<IEditMarketInfo> {
    await this.actions.put(`/back-api/backoffice/market/${market.id}`, converMarketRequest(market), {}, {});
    return market;
  }
}
