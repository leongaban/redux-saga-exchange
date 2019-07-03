import * as NS from '../../namespace';
import { IMarket } from 'shared/types/models';

export function setCurrentMarket(market: IMarket | null): NS.ISetCurrentMarket {
  return { type: 'MARKETS:SET_CURRENT_MARKET', payload: market };
}

export function reset(): NS.IReset {
  return { type: 'MARKETS:RESET' };
}
