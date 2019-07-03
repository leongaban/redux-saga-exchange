export function roundFloat(x: number, decimal: number) {
  const precision = Math.pow(10, decimal);
  return Math.round(x * precision) / precision;
}
