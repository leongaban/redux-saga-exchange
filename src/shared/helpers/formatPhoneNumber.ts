import * as R from 'ramda';

export default function formatPhoneNumber(value: string) {
  let result = [];
  const first = R.head(value);
  const tail = R.tail(value);
  const countryCode = R.splitAt(3, tail)[0];
  const rest = R.splitAt(3, tail)[1];

  result.push(`+${first}`);
  if (countryCode) {
    result.push(`(${countryCode}${rest ? ')' : ''}`);
  }
  if (rest) {
    result = R.concat(result, R.splitEvery(3, rest));
  }
  return R.join(' ', result);
}
