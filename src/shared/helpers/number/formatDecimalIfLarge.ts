const separator = ',';

function splitInteger(n: number, remainders: string[]): string {
  if (n < 1000) {
    return [n.toString(), ...remainders.reverse()].join(separator); // reverse to keep correct order of remainders
  }
  return splitInteger(Math.floor(n / 1000), [...remainders, (n % 1000).toString().padStart(3, '0')]);
}

export function formatDecimalIfLarge(num: string | number): string {
  const stringedNumber: string = typeof num === 'number' ? num.toString() : num;
  const match = /^(\d+)(?:\.(\d*))?$/g.exec(stringedNumber);

  if (match !== null) {
    const [, integerPart, fractionalPart] = match;
    const formattedIntegerPart = splitInteger(+integerPart, []);
    const formattedFractionalPart = fractionalPart
      ? `.${fractionalPart}`
      : '';
    return `${formattedIntegerPart}${formattedFractionalPart}`;
  }
  console.error('unexpected decimal for formatting ', num);
  return stringedNumber;
}
