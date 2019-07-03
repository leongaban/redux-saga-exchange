import { IExchangeRateDict } from 'shared/types/models';

import * as NS from '../../namespace';

export function applyDiff(x: IExchangeRateDict): NS.IApplyMiniTickerDiff {
  return { type: 'MINITICKER_DATA_SOURCE:APPLY_MINITICKER_DIFF', payload: x };
}

export function subscribe(payload: string): NS.ISubscribe {
  return { type: 'MINITICKER_DATA_SOURCE:SUBSCRIBE', payload };
}

export function unsubscribe(payload: string): NS.IUnsubscribe {
  return { type: 'MINITICKER_DATA_SOURCE:UNSUBSCRIBE', payload };
}

export function reset(): NS.IReset {
  return { type: 'MINITICKER_DATA_SOURCE:RESET' };
}
