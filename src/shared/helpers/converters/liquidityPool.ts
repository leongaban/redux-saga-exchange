import {
  // IGetLPAssetsResponse,
  IGetLPAssetsData,
  ILPAssetsResponse,
  IServerLPAsset, ILPAsset
} from 'shared/types/models/liquidityPool';

export function convertLPAssetsResponse(data: IGetLPAssetsData): ILPAssetsResponse {
  return {
    poolTotalTio: data.pool_total_tio,
    lastPayoutTs: data.last_payout_timestamp,
    timeValid: data.time_valid,
    assets: data.assets ? data.assets.map(convertLPAsset) : []
  };
}

export function convertLPAsset(asset: IServerLPAsset): ILPAsset {
  return {
    symbol: asset.symbol,
    lastPayout: asset.last_payout,
    historical: asset.historical
  };
}
