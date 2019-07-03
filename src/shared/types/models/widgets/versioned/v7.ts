import { Omit, IHoldingVersion } from 'shared/types/app';
import * as V6 from './v6';

export { IVersionedTypes } from './v6';

export interface IUserConfig extends Omit<V6.IUserConfig, 'version'>, IHoldingVersion<7> { }
