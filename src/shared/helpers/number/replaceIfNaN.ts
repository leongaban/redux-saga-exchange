export function replaceIfNaN(value: number, replacement: any = 0) {
  return Number.isNaN(value) ? replacement : value;
}
