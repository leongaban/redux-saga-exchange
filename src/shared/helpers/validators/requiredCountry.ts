import { ICountry } from 'shared/types/models';

const message = 'field is required';

export function requiredCountry(value: ICountry | string | undefined): string | undefined {
  if (value) {
    if (typeof value === 'string') {
      if (value.trim() === '') {
        return message;
      }
    } else {
      if (value.name.trim() === '') {
        return message;
      }
    }
  } else {
    return message;
  }
}
