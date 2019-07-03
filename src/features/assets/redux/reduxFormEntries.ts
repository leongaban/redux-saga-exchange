import { makeReduxFormEntry } from 'shared/helpers/redux';
import * as NS from '../namespace';

export const editAssetFormEntry = makeReduxFormEntry<NS.IEditAssetForm>('editAsset',
  ['canDeposit',
    'canWithdrawal',
    'withdrawalFee',
    'scale',
  ]);

export const assetsSearchFormEntry = makeReduxFormEntry<NS.IAssetsSearchForm>('assetsSearch',
  ['search']);
