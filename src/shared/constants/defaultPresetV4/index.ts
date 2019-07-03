// this preset is for the migrator use only

import { IVersionedTypes } from 'shared/types/models/widgets/versioned/v4';

import layouts from './layouts';
import * as settingsDefaults from './settings';

export const preset: IVersionedTypes['IPreset'] = {
  name: 'ALL',
  layouts, settings: settingsDefaults.presetWidgetsSettings,
};
