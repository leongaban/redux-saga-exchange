import * as R from 'ramda';

const zeroCharacter = '0';

export function divideZeroTail(value: string, charIndex: number = value.length - 1): string[] | undefined {
  if (value.charAt(charIndex) !== zeroCharacter) {
    return R.splitAt(charIndex + 1, value);
  }

  if (value.charAt(charIndex) === zeroCharacter) {
    return divideZeroTail(value, charIndex - 1);
  }
}
