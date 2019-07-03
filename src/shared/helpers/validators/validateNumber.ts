const numberError = 'value is not number';
const numberReg = /^(^[1-9][0-9]*\.?([0-9]+)?|(0($|\.[0-9]*)?))$/;

export function validateNumber(value: string | undefined): string | undefined {
  const valueStr = value ? value : '';
  return numberReg.test(valueStr) ? undefined : numberError;
}
