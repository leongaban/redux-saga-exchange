import { IOrderBookInfo } from 'shared/types/models';

import * as NS from '../../namespace';

export function applyDiff(x: IOrderBookInfo): NS.IApplyOrderBookDiff {
  return { type: 'ORDER_BOOK_DATA_SOURCE:APPLY_ORDER_BOOK_DIFF', payload: x };
}

export function subscribe(payload: string): NS.ISubscribe {
  return { type: 'ORDER_BOOK_DATA_SOURCE:SUBSCRIBE', payload };
}

export function unsubscribe(payload: string): NS.IUnsubscribe {
  return { type: 'ORDER_BOOK_DATA_SOURCE:UNSUBSCRIBE', payload };
}

export function reset(): NS.IReset {
  return { type: 'ORDER_BOOK_DATA_SOURCE:RESET' };
}
