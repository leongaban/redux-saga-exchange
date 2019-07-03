import * as NS from '../../namespace';
import { TwoFAType } from 'shared/types/models';

export function setRetriesAmount(amount: number): NS.ISetRetriesAmount {
  return { type: 'PROTECTOR:SET_RETRIES_AMOUNT', payload: amount };
}

export function setProvider(payload: TwoFAType): NS.ISetProvider {
  return { type: 'PROTECTOR:SET_PROVIDER', payload };
}
