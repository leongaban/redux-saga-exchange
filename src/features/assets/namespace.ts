import { IAction } from 'shared/types/redux';
import { IAssetInfo } from 'shared/types/models';

export interface IReduxState {
  edit: {
    conversionCurrency: string;
    currentAsset: IAssetInfo | null;
  };
  ui: {
    isEditAssetModalShown: boolean;
  };
}

export interface IAssetsSearchForm {
  search: string;
}

export type IEditAssetForm = IAssetInfo;

export type ISetEditAssetModalState = IAction<'ASSETS:SET_EDIT_ASSET_MODAL_STATE', boolean>;

export type ISetConversionCurrency = IAction<'ASSETS:SET_CONVERSION_CURRENCY', string>;

export type ISetCurrentAsset = IAction<'ASSETS:SET_CURRENT_ASSET', IAssetInfo>;

export type Action = ISetConversionCurrency | ISetEditAssetModalState | ISetCurrentAsset;
