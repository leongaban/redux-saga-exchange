import { curry } from 'ramda';

export const moreThan = curry(
  (message: string, bound: number, value: string | undefined) => {
    if (value !== undefined && +value <= bound) {
      return message;
    }
  });
