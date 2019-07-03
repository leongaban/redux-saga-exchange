import { IPreset } from 'shared/types/models';

function maxLengthValidator(value: string | undefined, max: number) {
  return value && value.length > max ? `Exceeded max length, max length is ${max}` : undefined;
}

function lengthValidator(value: string | undefined, valueLength: number) {
  return value && value.length !== valueLength
    ? `Incorrect length, should be ${valueLength} symbols`
    : undefined;
}

export function length(x: number) {
  return (value: string | undefined): string | undefined => {
    return lengthValidator(value, x);
  };
}

export function maxLength(max: number) {
  return (value: string | undefined): string | undefined => {
    return maxLengthValidator(value, max);
  };
}

export function presetMaxLengthName(max: number) {
  return (value: IPreset | undefined): string | undefined => {
    if (value) {
      return maxLengthValidator(value.name, max);
    }
    return;
  };
}
