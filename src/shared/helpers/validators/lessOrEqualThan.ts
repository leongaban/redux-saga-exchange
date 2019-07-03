import * as R from 'ramda';

export const lessOrEqualThan = R.curry(
  (message: string, bound: number, value: string | undefined) => {
    if (value !== undefined && +value > bound) {
      return message;
    }
  });
