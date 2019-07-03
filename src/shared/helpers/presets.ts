import * as R from 'ramda';
import {
  IPreset, IPresetLayouts, IResponsiveLayouts,
  IPartialResponsiveLayouts, IWidgetLayout
} from 'shared/types/models';

export function arePresetsLayoutsChanged(currentPresetsLayouts: IPresetLayouts[], prevPresets: IPreset[]): boolean {
  return currentPresetsLayouts.some((curr: IPresetLayouts): boolean => {
    const prevPreset = prevPresets.find(x => x.name === curr.name);
    if (prevPreset) {
      return !R.equals(
        removeUnusedLayoutFields(curr.layouts),
        removeUnusedLayoutFields(prevPreset.layouts),
      );
    }
    return false;
  });
}

function removeUnusedLayoutFields(layouts: IResponsiveLayouts): IPartialResponsiveLayouts {
  return R.map(
    (xs: IWidgetLayout[] | undefined) => {
      return xs && xs.map((x: IWidgetLayout) => {
        return R.pick(['w', 'h', 'x', 'y'], x);
      });
    },
    layouts,
  );
}

export function getCommonPresetsLayoutsFromOldAndAddToNew(
  oldPresetsLayouts: IPresetLayouts[],
  newPresetsLayouts: IPresetLayouts[]
): IPresetLayouts[] {
  return newPresetsLayouts.map((newPresetLayouts: IPresetLayouts) => {
    const oldPreset = oldPresetsLayouts.find(preset => preset.name === newPresetLayouts.name);
    if (oldPreset) {
      return {
        ...oldPreset,
      };
    } else {
      return {
        name: newPresetLayouts.name,
        layouts: { ...newPresetLayouts.layouts },
      };
    }
  });
}

export function getCommonPresetsFromOldAndAddToNew(oldPresets: IPreset[], newPresets: IPreset[]): IPreset[] {
  return newPresets.map((newPreset: IPreset) => {
    const oldPreset = oldPresets.find(preset => preset.name === newPreset.name);
    if (oldPreset) {
      return {
        ...oldPreset,
      };
    } else {
      return {
        ...newPreset,
      };
    }
  });
}

export function changePresetsLayouts(presets: IPreset[], newPresetsLayouts: IPresetLayouts[]): IPreset[] {
  return presets.map(preset => {
    const layout = newPresetsLayouts.find(presetLayout => presetLayout.name === preset.name);
    if (layout) {
      return {
        ...layout,
        settings: { ...preset.settings },
      };
    }
    return { ...preset };
  });
}
