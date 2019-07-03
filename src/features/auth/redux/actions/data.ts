import * as NS from '../../namespace';
import { ITwoFactorInfo } from 'shared/types/models';

export function setTwoFactorInfo(data: ITwoFactorInfo): NS.ISetTwoFactorInfo {
  return { type: 'AUTH:SET_TWO_FACTOR_INFO', payload: data };
}
