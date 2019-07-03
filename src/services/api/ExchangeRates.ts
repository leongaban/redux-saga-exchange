import { bind } from 'decko';
import BaseApi from './Base';
import { ILoadSettingsResponse } from './types/responses';

class ExchangeRatesApi extends BaseApi {

  @bind
  public async addFavorite(market: string): Promise<void> {
    await this.actions.put('/frontoffice/api/setting', {
      type: 'favorite-market',
      value: market,
    }, {}, {});
  }

  @bind
  public async removeFavorite(market: string): Promise<void> {
    await this.actions.del('/frontoffice/api/setting', {
      type: 'favorite-market',
      value: market,
    }, {}, {});
  }

  @bind
  public async loadFavorites(): Promise<string[]> {
    const response = await this.actions.get<ILoadSettingsResponse>('/frontoffice/api/settings');
    return response.data.data && response.data.data.favoriteMarkets ? response.data.data.favoriteMarkets : [];
  }
}

export default ExchangeRatesApi;
