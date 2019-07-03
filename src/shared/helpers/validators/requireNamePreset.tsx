import { IPreset } from 'shared/types/models';

export function requiredPresetName(value: IPreset | undefined): string | undefined {
  return value
    ? value.name
      ? undefined
      : 'Preset name is required'
    : 'Preset is undefined';
}
