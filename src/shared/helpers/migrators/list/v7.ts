import * as V6 from 'shared/types/models/widgets/versioned/v6';
import * as V7 from 'shared/types/models/widgets/versioned/v7';
import { IMigrator } from 'shared/types/app';
import { makePresetSettingsMigrator } from '../shared';

function convertTioAssetId(x: string) {
  return x.replace('tio', 'tiox');
}

function migrate(config: V6.IUserConfig): V7.IUserConfig {

  const updateExchangeRatesSettings = (
    y: V6.IVersionedTypes['IWidgetsSettingsAssoc']['exchange-rates']
  ): V7.IVersionedTypes['IWidgetsSettingsAssoc']['exchange-rates'] => ({
    ...y,
    currentMarketId: convertTioAssetId(y.currentMarketId),
  });

  const updateBalanceSettings = (
    y: V6.IVersionedTypes['IWidgetsSettingsAssoc']['balance']
  ): V7.IVersionedTypes['IWidgetsSettingsAssoc']['balance'] => ({
    ...y,
    currencyCodes: y.currencyCodes.map(x => convertTioAssetId(x)),
  });

  const newPresets = config.presets
    .map(x => makePresetSettingsMigrator<V6.IVersionedTypes['WidgetKind'], 'exchange-rates'>
      ('exchange-rates')
      (x, updateExchangeRatesSettings))
    .map(x => makePresetSettingsMigrator<V6.IVersionedTypes['WidgetKind'], 'balance'>
      ('balance')
      (x, updateBalanceSettings));

  return {
    ...config,
    presets: newPresets,
    version: 7,
  };
}

export const v7Migrator: IMigrator<7> = { migrate, version: 7 };
