import { Omit, IHoldingVersion } from 'shared/types/app';

import * as V10 from './v10';
export { IVersionedTypes } from './v10';

export interface IUserConfig extends Omit<V10.IUserConfig, 'version'>, IHoldingVersion<11> {
  shouldOpenMarketOrderWarningModal: boolean;
}
