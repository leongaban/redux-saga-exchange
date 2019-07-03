import { Omit, IHoldingVersion } from 'shared/types/app';

import * as V11 from './v11';

export { IVersionedTypes } from './v11';

export interface IUserConfig extends Omit<V11.IUserConfig, 'version'>, IHoldingVersion<12> {
  isSecurityNoticeConfirmed: boolean;
}
