import { IAssetsInfoMap } from '../../types/models';
import { formatDecimalIfLarge } from './formatDecimalIfLarge';
import { formatAsset } from './formatAsset';

export function formatAssetWithCommas(
  asset: string, value: number, assetsInfo: IAssetsInfoMap, fallbackScale: number = 2,
): string {
  return formatDecimalIfLarge(formatAsset(asset, value, assetsInfo, fallbackScale));
}
