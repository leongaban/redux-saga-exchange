import { IAssetInfoResponse, IAssetsInfoResponse, IAssetInfo, IAssetsInfoMap } from 'shared/types/models';

export function convertAssetInfo(asset: IAssetInfoResponse): IAssetInfo {
  return {
    assetName: asset.asset_name,
    canDeposit: asset.can_deposit,
    canWithdrawal: asset.can_withdrawal,
    withdrawalFee: asset.withdrawal_fee,
    imageUrl: asset.image_url,
    scale: asset.scale,
  };
}

export function convertAssetInfoToOptions(assetInfo: IAssetInfo) {
  return {
    scale: assetInfo.scale,
    can_deposit: assetInfo.canDeposit,
    can_withdraw: assetInfo.canWithdrawal,
    withdraw_fee: assetInfo.withdrawalFee,
  };
}

export function convertAssetsInfo(assets: IAssetsInfoResponse): IAssetsInfoMap {
  return assets.data.reduce((prev, cur) => {
    return {
      ...prev,
      [cur.id]: convertAssetInfo(cur),
    };
  }, {});
}
