import { IAssetsInfoMap } from '../../types/models';

export function formatAsset(asset: string, value: number, assetsInfo: IAssetsInfoMap, fallbackScale: number = 2) {
  const accuracy = (() => {
    const info = assetsInfo[asset];
    if (info) {
      return info.scale;
    }
    console.warn('no info for asset', asset);
    return fallbackScale;
  })();
  return value.toFixed(accuracy);
}
