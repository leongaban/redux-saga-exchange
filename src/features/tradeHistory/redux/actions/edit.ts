import * as NS from '../../namespace';

export function setExtendedTradesTotalPages(x: number): NS.ISetExtendedTradesTotalPages {
  return { type: 'TRADE_HISTORY:SET_EXTENDED_TRADES_TOTAL_PAGES', payload: x };
}
