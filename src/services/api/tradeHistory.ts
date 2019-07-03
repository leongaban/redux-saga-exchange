import { bind } from 'decko';

import { IPagedExtendedTrades } from 'shared/types/models';
import { ILoadFilteredExtendedTradesRequest } from 'shared/types/requests/tradeHistory';
import { convertTradeHistoryServerResponse, makeTradeHistoryFilterGetRequest } from './converters';
import BaseApi from './Base';
import { ITradeHistoryServerResponse } from './types';

class TradeHistoryApi extends BaseApi {

  @bind
  public async load(request: ILoadFilteredExtendedTradesRequest): Promise<IPagedExtendedTrades> {
    const url = makeTradeHistoryFilterGetRequest(request);
    const response = await this.actions.get<ITradeHistoryServerResponse>(`/frontoffice/api/trade_history?${url}`);
    return {
      data: response.data.data.map(convertTradeHistoryServerResponse),
      totalPages: response.data.paging.page,
    };
  }
}

export default TradeHistoryApi;
