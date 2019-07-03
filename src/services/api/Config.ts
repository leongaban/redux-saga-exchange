import { bind } from 'decko';

import {
  IAssetsInfoResponse, IAssetsInfoMap, IAssetInfo, ICountry, IUserConfig, ICurrencyPair, IMConfig, IHoldingTheme
} from 'shared/types/models';
import { migrateToLatest } from 'shared/helpers/migrators';
import { defaultUserConfig, mDefaultConfig } from 'shared/constants';
import { TradeioApiResponseInfoResponse } from 'shared/types/frontoffice_server';

import BaseApi from './Base';
import * as converters from './converters';
import { ILoadSettingsResponse } from './types';

export default class AssetsInfoApi extends BaseApi {

  @bind
  public async loadAssetsInfo(): Promise<IAssetsInfoMap> {
    const assetsInfoResponse = await this.actions.get<IAssetsInfoResponse>('frontoffice/api/assets-info');
    const assetsInfo = converters.convertAssetsInfo(assetsInfoResponse.data);
    return assetsInfo;
  }

  @bind
  public async updateAsset(assetId: string, assetInfo: IAssetInfo) {
    const assetOptions = converters.convertAssetInfoToOptions(assetInfo);
    await this.actions.put(`/back-api/backoffice/asset/${assetId}`, assetOptions, {}, {});
  }

  @bind
  public async loadCurrencyPairs(): Promise<ICurrencyPair[]> {
    const currencyPairsResponse = await this.actions.get<TradeioApiResponseInfoResponse>('/frontoffice/api/info');
    const currencyPairs: ICurrencyPair[] = converters.convertCurrencyPairsResponse(currencyPairsResponse.data);
    return currencyPairs;
  }

  @bind
  public async loadCountries(query: string): Promise<ICountry[]> {
    const response = await this.actions.get<any>(`/frontoffice/backoffice/countries?${query}`);
    return response.data.data;
  }

  @bind
  public async loadUserConfig(): Promise<IUserConfig & IHoldingTheme> {
    const response = await this.actions.get<ILoadSettingsResponse>('/frontoffice/api/settings');
    if (response.data.data) {
      if (response.data.data.presets) {

        const config = JSON.parse(response.data.data.presets);
        return {
          ...migrateToLatest(config),
          theme: config.theme,
        };
      }
    }
    return {
      ...defaultUserConfig,
      theme: 'day',
    };
  }

  @bind
  public async mLoadConfig(): Promise<IMConfig> {
    const response = await this.actions.get<ILoadSettingsResponse>('/frontoffice/api/settings');
    if (response.data.data) {
      if (response.data.data.mobileConfig) {
        return JSON.parse(response.data.data.mobileConfig);
      } else {
        console.log('no mobile config, returning default one');
      }
    } else {
      console.warn('unexpected response structrure on mLoadConfig', response.data);
    }
    return mDefaultConfig;
  }

  @bind
  public async mSaveConfig(x: IMConfig): Promise<void> {
    await this.actions.put('/frontoffice/api/setting', {
      type: 'mobile-config',
      value: JSON.stringify(x),
    }, {}, {});
  }

  @bind
  public async setUserConfig(config: IUserConfig & IHoldingTheme) {
    await this.actions.put('/frontoffice/api/setting', {
      type: 'preset',
      value: JSON.stringify(config),
    }, {}, {});
  }
}
