import * as NS from '../../namespace';

export function setDecimals(x: number): NS.ISetDecimals {
  return { type: 'ORDER_BOOK:SET_DECIMALS', payload: x };
}
