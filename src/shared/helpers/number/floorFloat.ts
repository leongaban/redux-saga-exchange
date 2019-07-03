import { Decimal } from 'decimal.js';

export function floorFloat(x: number, decimals: number) {
  return new Decimal(x).toDecimalPlaces(decimals, Decimal.ROUND_FLOOR);
}
