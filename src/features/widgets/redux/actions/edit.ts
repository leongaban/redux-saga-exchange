import * as NS from '../../namespace';

export function setActivePresetWhenItDoesNotExist(): NS.ISetActivePresetWhenItDoesNotExist {
  return { type: 'WIDGETS:SET_ACTIVE_PRESET_WHEN_IT_DOES_NOT_EXIST' };
}
