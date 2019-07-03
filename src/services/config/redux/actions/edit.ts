import { IPresetLayouts } from 'shared/types/models';

import * as NS from '../../namespace';

export function setCurrentPresetsLayouts(payload: IPresetLayouts[]): NS.ISetCurrentPresetsLayouts {
  return { type: 'CONFIG:SET_CURRENT_PRESETS_LAYOUTS', payload };
}

export function setPresetsHaveUnsavedChanges(payload: boolean): NS.ISetPresetsHaveUnsavedChanges {
  return { type: 'CONFIG:SET_PRESETS_HAVE_UNSAVED_CHANGES', payload };
}

export function saveCurrentPresetsLayouts(): NS.ISaveCurrentPresetsLayouts {
  return { type: 'CONFIG:SAVE_CURRENT_PRESETS_LAYOUTS' };
}

export function mSetCurrentCurrencyPairID(payload: string): NS.IMSetCurrentCurrencyPairID {
  return { type: 'CONFIG:M:SET_CURRENT_CURRENCY_PAIR_ID', payload };
}
