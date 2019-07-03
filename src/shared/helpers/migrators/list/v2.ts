import { ISettings } from 'shared/types/models';
import * as V1 from 'shared/types/models/widgets/versioned/v1';
import * as V2 from 'shared/types/models/widgets/versioned/v2';
import { settingsDefaults } from 'shared/constants';
import { IMigrator } from 'shared/types/app';

function migrate(config: V1.IUserConfig): V2.IUserConfig {
  const newPresets = config.presets.map(x => {
    const widgetLayouts = Object.values(x.layouts)[0];
    if (widgetLayouts) {
      const placeOrderWidgetUIDS = widgetLayouts
        .filter(y => y.kind === 'place-order')
        .map(y => y.i!);

      const placeOrderSettings: ISettings<V2.IVersionedTypes['IWidgetsSettingsAssoc']['place-order']>
        = placeOrderWidgetUIDS.reduce(
          (acc, y): ISettings<V2.IVersionedTypes['IWidgetsSettingsAssoc']['place-order']> => ({
            // TODO should we use default settings here?
            [y]: { sidesDisplayMethod: settingsDefaults.widgetSettings['place-order'].sidesDisplayMethod },
            ...acc,
          })
          , {} as ISettings<V2.IVersionedTypes['IWidgetsSettingsAssoc']['place-order']>);

      return {
        ...x,
        settings: {
          ...x.settings,
          'place-order': placeOrderSettings,
        }

      };

    } else {
      console.warn('empty widget layouts');
      return x as V2.IVersionedTypes['IPreset'];
    }
  });

  return {
    ...config,
    version: 2,
    areTOSAccepted: config.areTOSAccepted ? config.areTOSAccepted : false,
    presets: newPresets,
  };
}

export const v2Migrator: IMigrator<2> = { migrate, version: 2 };
