import { Decimal } from 'decimal.js';

export function floorFloatToFixed(x: number, decimal: number): string {
  return new Decimal(x).toFixed(decimal, Decimal.ROUND_DOWN).toString();
}
