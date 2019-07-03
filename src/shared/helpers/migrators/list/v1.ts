import * as V0 from 'shared/types/models/widgets/versioned/v0';
import * as V1 from 'shared/types/models/widgets/versioned/v1';
import { IMigrator } from 'shared/types/app';
import { settingsDefaults } from 'shared/constants';

import { makePresetSettingsMigrator } from '../shared';

type IChartSettingsV0 = V0.IVersionedTypes['IWidgetsSettingsAssoc']['chart'];
type IChartSettingsV1 = V1.IVersionedTypes['IWidgetsSettingsAssoc']['chart'];

type IOrderBookSettingsV0 = V0.IVersionedTypes['IWidgetsSettingsAssoc']['order-book'];
type IOrderBookSettingsV1 = V1.IVersionedTypes['IWidgetsSettingsAssoc']['order-book'];

function migrate(config: V0.IUserConfig): V1.IUserConfig {

  // config migration is implemented at V1, so V0 settings may have properties of V1 settings
  const updateChartSettings =
    (y: IChartSettingsV0 & Partial<IChartSettingsV1>): IChartSettingsV1 => ({
      activeChartKind: y.activeChartKind || settingsDefaults.widgetSettings.chart.activeChartKind,
      indicators: y.indicators,
      interval: y.interval,
      isZoomEnabled: y.isZoomEnabled,
      periodicity: y.periodicity,
    });

  const updateOrderBookSettings =
    (y: IOrderBookSettingsV0 & Partial<IOrderBookSettingsV1>): IOrderBookSettingsV1 => ({
      decimals: y.decimals,
      displayedOrderType: y.displayedOrderType || settingsDefaults.widgetSettings['order-book'].displayedOrderType,
      shouldOpenModalOnPlaceOrderRequest: y.shouldOpenModalOnPlaceOrderRequest
        ? y.shouldOpenModalOnPlaceOrderRequest
        : settingsDefaults.widgetSettings['order-book'].shouldOpenModalOnPlaceOrderRequest,
      widgetType: y.widgetType || settingsDefaults.widgetSettings['order-book'].widgetType,
    });

  // NOTE TS bug: when expression of newPresets moved to config object
  // compiler ignores incorrect type passing

  const newPresets = config.presets
    .map(x => makePresetSettingsMigrator<V0.IVersionedTypes['WidgetKind'], 'chart'>
      ('chart')
      (x, updateChartSettings))
    .map(x => makePresetSettingsMigrator<V0.IVersionedTypes['WidgetKind'], 'order-book'>
      ('order-book')
      (x, updateOrderBookSettings));

  return {
    version: 1,
    activePresetName: config.activePresetName,
    areTOSAccepted: config.areTOSAccepted ? config.areTOSAccepted : false,
    presets: newPresets,
    savedWithdrawalAddresses: {},
  };
}

export const v1Migrator: IMigrator<1> = { migrate, version: 1 };
