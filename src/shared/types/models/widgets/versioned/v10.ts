import { Omit, IHoldingVersion } from 'shared/types/app';

import * as V9 from './v9';

export { IVersionedTypes } from './v9';

export interface IUserConfig extends Omit<V9.IUserConfig, 'version'>, IHoldingVersion<10> {
  hideSmallBalances: boolean;
}
