
export function formatFloatIfLarge(x: number, decimal: number): string {
  const stringedNumber = x.toString();
  if (stringedNumber.length > decimal && stringedNumber.indexOf('.') > 0) {
    return x.toFixed(decimal);
  }
  return x.toString();
}
