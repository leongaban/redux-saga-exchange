import { Omit, IHoldingVersion } from 'shared/types/app';
import { ISavedWithdrawalAddresses } from 'shared/types/models';

import { OrderBookWidgetType, DisplayedOrderType } from '../../orderBook';
import { ChartKind } from '../shared';
import { IGenericVersionedTypes, GetSettings, GetSettingsAssoc, GetFormSettingsAssoc } from '../helpers';
import * as V0 from './v0';

interface IStockChartSettings extends Omit<GetSettings<V0.IVersionedTypes, 'chart'>, 'contentType'> {
  activeChartKind: ChartKind;
}

interface IOrderBookFormSettings {
  shouldOpenModalOnPlaceOrderRequest: boolean;
}

interface IOrderBookSettings extends GetSettings<V0.IVersionedTypes, 'order-book'>, IOrderBookFormSettings {
  widgetType: OrderBookWidgetType;
  displayedOrderType: DisplayedOrderType;
}

interface IWidgetsSettingsAssoc extends Omit<GetSettingsAssoc<V0.IVersionedTypes>, 'chart' | 'order-book'> {
  'chart': IStockChartSettings;
  'order-book': IOrderBookSettings;
}

interface IWidgetsFormSettingsAssoc extends Omit<GetFormSettingsAssoc<V0.IVersionedTypes>, 'order-book'> {
  'order-book': IOrderBookFormSettings;
}

export type IVersionedTypes = IGenericVersionedTypes<
  V0.IVersionedTypes['WidgetKind'],
  IWidgetsSettingsAssoc,
  IWidgetsFormSettingsAssoc
  >;

export interface IUserConfig extends Omit<V0.IUserConfig, 'presets' | 'areTOSAccepted' | 'theme'>, IHoldingVersion<1> {
  presets: Array<IVersionedTypes['IPreset']>;
  areTOSAccepted: boolean;
  savedWithdrawalAddresses: ISavedWithdrawalAddresses;
}
