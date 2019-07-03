import { IUserConfig } from 'shared/types/models';
import * as NS from '../../namespace';

export function setUserConfig(payload: Partial<IUserConfig>): NS.ISetUserConfig {
  return { type: 'CONFIG:SET_USER_CONFIG', payload };
}
