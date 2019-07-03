import { IPreset, IPresetLayouts} from 'shared/types/models';

export function convertToPresetLayouts(preset: IPreset): IPresetLayouts {
  return {
    name: preset.name,
    layouts: preset.layouts,
  };
}
