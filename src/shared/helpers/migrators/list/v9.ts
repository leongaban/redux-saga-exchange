import * as V8 from 'shared/types/models/widgets/versioned/v8';
import * as V9 from 'shared/types/models/widgets/versioned/v9';
import { IMigrator } from 'shared/types/app';
import { settingsDefaults } from 'shared/constants';
import { makePresetSettingsMigrator } from '../shared';

function migrate(config: V8.IUserConfig): V9.IUserConfig {

  const updateReportingSettings = (
    y: V8.IVersionedTypes['IWidgetsSettingsAssoc']['reporting']
  ): V9.IVersionedTypes['IWidgetsSettingsAssoc']['reporting'] => ({
    ...y,
    operationHistory: settingsDefaults.widgetSettings['operation-history'],
  });

  // tslint:disable:max-line-length
  const newPresets = config.presets
    .map(x => makePresetSettingsMigrator<V9.IVersionedTypes['WidgetKind'], 'reporting'>
      ('reporting')
      (x, updateReportingSettings));

  return {
    ...config,
    presets: newPresets,
    version: 9,
  };
}

export const v9Migrator: IMigrator<9> = { migrate, version: 9 };
