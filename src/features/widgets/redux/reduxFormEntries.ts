import { makeReduxFormEntry } from 'shared/helpers/redux';
import * as NS from '../namespace';

export const newPresetFormEntry = makeReduxFormEntry<NS.INewPresetFormData>(
  'newPresetForm', ['name'],
);

export const managePresetsFormEntry = makeReduxFormEntry<NS.IManagePresetsFormData>(
  'managePresetsForm', ['presets'],
);

export const addPresetFormEntry = makeReduxFormEntry<NS.IAddPresetFormData>(
  'addPresetForm', ['name'],
);
