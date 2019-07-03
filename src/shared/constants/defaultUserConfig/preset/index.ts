import { IPreset } from 'shared/types/models';

import layouts from './layouts';
import * as settingsDefaults from './settings';

export const preset: IPreset = { name: 'ALL', layouts, settings: settingsDefaults.presetWidgetsSettings };

export { settingsDefaults };
