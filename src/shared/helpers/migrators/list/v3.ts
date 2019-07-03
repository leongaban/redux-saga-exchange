import { ISettings } from 'shared/types/models';
import * as V2 from 'shared/types/models/widgets/versioned/v2';
import * as V3 from 'shared/types/models/widgets/versioned/v3';
import { settingsDefaults } from 'shared/constants';
import { IMigrator } from 'shared/types/app';

function migrate(config: V2.IUserConfig): V3.IUserConfig {
  const newPresets = config.presets.map((preset: V2.IVersionedTypes['IPreset']) => {
    const widgetLayouts = Object.values(preset.layouts)[0];
    if (widgetLayouts) {
      const orderListWidgetUIDS = widgetLayouts
        .filter(layout => layout.kind === 'order-list')
        .map(layout => layout.i!);

      const orderListSettings: ISettings<V3.IVersionedTypes['IWidgetsSettingsAssoc']['order-list']>
        = orderListWidgetUIDS.reduce(
          (acc, UID): ISettings<V3.IVersionedTypes['IWidgetsSettingsAssoc']['order-list']> => {
            const settings = preset.settings['order-list'][UID] || settingsDefaults.widgetSettings['order-list'];
            return {
              [UID]: { ...settings, shouldOpenCancelOrderModal: true },
              ...acc,
            };
          }, {} as ISettings<V3.IVersionedTypes['IWidgetsSettingsAssoc']['order-list']>);

      return {
        ...preset,
        settings: {
          ...preset.settings,
          'order-list': orderListSettings,
        }

      };

    } else {
      console.warn('empty widget layouts');
      return preset as V3.IVersionedTypes['IPreset'];
    }
  });

  return {
    ...config,
    version: 3,
    presets: newPresets,
    reportsSettings: {
      openOrders: {
        shouldOpenCancelOrderModal: true,
      }
    },
  };
}

const v3Migrator: IMigrator<3> = { migrate, version: 3 };
export { v3Migrator };
