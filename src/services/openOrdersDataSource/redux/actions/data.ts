import { IActiveOrder, IArchiveOrder } from 'shared/types/models';

import * as NS from '../../namespace';

export function applyActiveOrdersDiff(x: IActiveOrder[]): NS.IApplyActiveOrdersDiff {
  return { type: 'OPEN_ORDERS_DATA_SOURCE:APPLY_ACTIVE_ORDERS_DIFF', payload: x };
}

export function applyArchiveOrdersDiff(x: IArchiveOrder[]): NS.IApplyArchiveOrdersDiff {
  return { type: 'OPEN_ORDERS_DATA_SOURCE:APPLY_ARCHIVE_ORDERS_DIFF', payload: x };
}

export function subscribe(payload: string): NS.ISubscribe {
  return { type: 'OPEN_ORDERS_DATA_SOURCE:SUBSCRIBE', payload };
}

export function unsubscribe(payload: string): NS.IUnsubscribe {
  return { type: 'OPEN_ORDERS_DATA_SOURCE:UNSUBSCRIBE', payload };
}

export function reset(): NS.IReset {
  return { type: 'OPEN_ORDERS_DATA_SOURCE:RESET' };
}
