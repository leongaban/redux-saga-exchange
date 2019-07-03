import * as V7 from 'shared/types/models/widgets/versioned/v7';
import * as V8 from 'shared/types/models/widgets/versioned/v8';
import { IMigrator } from 'shared/types/app';
import { makePresetSettingsMigrator } from '../shared';

function migrate(config: V7.IUserConfig): V8.IUserConfig {

  const updateOrderBookSettings = (
    y: V7.IVersionedTypes['IWidgetsSettingsAssoc']['order-book']
  ): V8.IVersionedTypes['IWidgetsSettingsAssoc']['order-book'] => ({
    ...y,
    depthView: false,
  });

  const newPresets = config.presets
    .map(x => makePresetSettingsMigrator<V8.IVersionedTypes['WidgetKind'], 'order-book'>
      ('order-book')
      (x, updateOrderBookSettings));

  return {
    ...config,
    presets: newPresets,
    version: 8,
  };
}

export const v8Migrator: IMigrator<8> = { migrate, version: 8 };
