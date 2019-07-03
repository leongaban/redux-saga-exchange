import * as NS from '../../namespace';
import { IOperation } from 'shared/types/models';

export function applyDiff(x: IOperation[]): NS.IApplyDiff {
  return { type: 'OPERATION_HISTORY:APPLY_DIFF', payload: x };
}

export function subscribe(payload: string): NS.ISubscribe {
  return { type: 'OPERATION_HISTORY:SUBSCRIBE', payload };
}

export function unsubscribe(payload: string): NS.IUnsubscribe {
  return { type: 'OPERATION_HISTORY:UNSUBSCRIBE', payload };
}
