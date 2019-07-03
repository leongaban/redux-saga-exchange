import { IAssetInfo } from 'shared/types/models';

import * as NS from '../../namespace';

export function setConversionCurrency(payload: string): NS.ISetConversionCurrency {
  return { type: 'ASSETS:SET_CONVERSION_CURRENCY', payload };
}

export function setCurrentAsset(payload: IAssetInfo): NS.ISetCurrentAsset {
  return { type: 'ASSETS:SET_CURRENT_ASSET', payload };
}
