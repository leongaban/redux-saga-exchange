import * as V4 from 'shared/types/models/widgets/versioned/v4';
import * as V5 from 'shared/types/models/widgets/versioned/v5';
import { settingsDefaults } from 'shared/constants';
import { IMigrator } from 'shared/types/app';
import { makePresetSettingsMigrator } from '../shared';

function migrate(config: V4.IUserConfig): V5.IUserConfig {

  const updateChartSettings = (
    y: V4.IVersionedTypes['IWidgetsSettingsAssoc']['chart']
  ): V5.IVersionedTypes['IWidgetsSettingsAssoc']['chart'] => ({
    ...y,
    candlesticksChartKind: settingsDefaults.widgetSettings.chart.candlesticksChartKind,
    tvIndicators: settingsDefaults.widgetSettings.chart.tvIndicators,
    barStyle: settingsDefaults.widgetSettings.chart.barStyle,
  });

  const newPresets = config.presets
    .map(x => makePresetSettingsMigrator<V4.IVersionedTypes['WidgetKind'], 'chart'>('chart')(x, updateChartSettings));

  return {
    ...config,
    version: 5,
    presets: newPresets,
  };
}

export const v5Migrator: IMigrator<5> = { migrate, version: 5 };
