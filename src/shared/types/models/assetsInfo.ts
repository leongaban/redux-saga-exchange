import { TableColumns } from '../ui';

export interface IAssetInfoResponse {
  id: string;
  can_deposit: boolean;
  can_withdrawal: boolean;
  image_url: string;
  asset_name: string;
  withdrawal_fee: number;
  scale: number;
}

export interface IAssetsInfoResponse {
  data: IAssetInfoResponse[];
}

export interface IAssetInfoTableColumnData {
  assetName: string;
  canDeposit: boolean;
  canWithdrawal: boolean;
  withdrawalFee: number;
  scale: number;
}

export interface IAssetInfoTableNonColumnData {
  imageUrl: string;
}

export type IAssetInfo = IAssetInfoTableColumnData & IAssetInfoTableNonColumnData;

export interface IAssetsInfoMap {
  // TODO fix type, could be undefined
  [name: string]: IAssetInfo;
}

export type IAssetInfoColumns = TableColumns<IAssetInfoTableColumnData, IAssetInfo>;
