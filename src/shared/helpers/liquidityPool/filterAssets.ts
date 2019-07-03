import * as R from 'ramda';

import { ILPAsset } from 'shared/types/models';

export const filterAssets = (typed: string, assets: ILPAsset[]): ILPAsset[] => {
  const checkSymbol = (asset: ILPAsset) => asset.symbol.includes(typed.toLowerCase());
  const filtered = R.filter(checkSymbol, assets);
  return filtered.length > 0 ? filtered : assets;
};
