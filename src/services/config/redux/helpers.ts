import { IAssetsInfoMap } from 'shared/types/models';
import UAParser from 'ua-parser-js';
import { memoize } from 'ramda';

export function getAssetIdFromAssetName(assetName: string, assetsInfo: IAssetsInfoMap): string | undefined {
  const assetIds: string[] = Object.keys(assetsInfo);
  return assetIds.find((id: string) => assetsInfo[id].assetName === assetName);
}

export const getUserAgentInfo = memoize((): IUAParser.IResult => new UAParser().getResult());
