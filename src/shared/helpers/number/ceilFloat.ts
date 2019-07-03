import { Decimal } from 'decimal.js';

export function ceilFloat(x: number, decimals: number) {
  return new Decimal(x).toDecimalPlaces(decimals, Decimal.ROUND_CEIL);
}
