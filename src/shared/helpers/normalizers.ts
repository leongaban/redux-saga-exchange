import moment from 'services/moment';

export function normalizeDate(ts: number) {
  return ts
    ? moment(ts).format('L')
    : '';
}

export function normalizeFloat(value: string | undefined, decimalPlaces: number) {
  return value
    ? fixedDecimals(
      value
        .replace(/^\.+/, '')
        .replace(/[^\d\.]/g, '')
        .replace(/^0+(\d+)/, '$1')
        .replace(/^(\d+\.)(.+)$/, (_, p1, p2) => {
          return p1 + p2.replace(/\./g, '');
        }),
      decimalPlaces)
    : '';
}

export function normalizeInteger(value: string | undefined) {
  return value
    ? value
      .replace(/[^\d]/g, '')
      .replace(/^0+(\d+)/, '$1')
    : '';
}

function fixedDecimals(value: string, decimalPlaces: number) {
  const splitValue = value.split('.');
  if (splitValue.length === 2) {
    return `${splitValue[0]}.${splitValue[1].slice(0, decimalPlaces)}`;
  }
  return value;
}
