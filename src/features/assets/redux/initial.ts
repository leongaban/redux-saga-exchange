import * as NS from '../namespace';

export const initial: NS.IReduxState = {
  edit: {
    conversionCurrency: 'btc',
    currentAsset: null,
  },
  ui: {
    isEditAssetModalShown: false,
  },
};
