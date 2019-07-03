import { TableColumns } from '../ui';

export interface ICurrencyGraph {
  [code: string]: ICurrencyRelation[];
}

export interface ICurrencyRelation {
  code: string;
  kind: 'forward' | 'backward';
}

export interface ICurrencyPath {
  initialCode: string;
  relations: ICurrencyRelation[];
}

export interface IAssetColumnData {
  code: string;
  name: string;
  total: number;
  available: number;
  inOrder: number;
  convertedTotal: number | null;
}

export interface IEstimatedAsset {
  name: string;
  value: number;
}

export interface IAssetNonColumnData {
  iconSrc: string;
  convertedTotalInBtc: number | null;
}

export interface IAsset extends IAssetColumnData, IAssetNonColumnData { }

export type IAssetColumns = TableColumns<IAssetColumnData, IAsset>;
