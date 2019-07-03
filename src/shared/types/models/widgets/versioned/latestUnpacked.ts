import { IVersionedTypes } from './latest';

export { IUserConfig } from './latest';

export type WidgetKind = IVersionedTypes['WidgetKind'];

export type IWidgetsSettingsAssoc = IVersionedTypes['IWidgetsSettingsAssoc'];
export type IWidgetsFormSettingsAssoc = IVersionedTypes['IWidgetsFormSettingsAssoc'];

export type WidgetSettings = IVersionedTypes['WidgetSettings'];
export type WidgetFormSettings = IVersionedTypes['WidgetFormSettings'];

export type WidgetsSettings = IVersionedTypes['WidgetsSettings'];

export type IPreset = IVersionedTypes['IPreset'];

export type IWidgetLayout = IVersionedTypes['IWidgetLayout'];
export type IRawWidgetLayout = IVersionedTypes['IRawWidgetLayout'];

export type IPresetLayouts = IVersionedTypes['IPresetLayouts'];
export type IResponsiveLayouts = IVersionedTypes['IResponsiveLayouts'];
export type IPartialResponsiveLayouts = IVersionedTypes['IPartialResponsiveLayouts'];

export type IBalanceSettings = IVersionedTypes['IWidgetsSettingsAssoc']['balance'];
export type IExchangeRatesSettings = IVersionedTypes['IWidgetsSettingsAssoc']['exchange-rates'];
export type IOrderListSettings = IVersionedTypes['IWidgetsSettingsAssoc']['order-list'];
export type IOrderHistorySettings = IVersionedTypes['IWidgetsSettingsAssoc']['order-history'];
export type IChatSettings = IVersionedTypes['IWidgetsSettingsAssoc']['chat'];
export type IStockChartSettings = IVersionedTypes['IWidgetsSettingsAssoc']['chart'];
export type IOrderBookSettings = IVersionedTypes['IWidgetsSettingsAssoc']['order-book'];
export type ITradeHistorySettings = IVersionedTypes['IWidgetsSettingsAssoc']['trade-history'];
export type IPlaceOrderSettings = IVersionedTypes['IWidgetsSettingsAssoc']['place-order'];
export type IOperationHistorySettings = IVersionedTypes['IWidgetsSettingsAssoc']['operation-history'];
export type IReportingSettings = IVersionedTypes['IWidgetsSettingsAssoc']['reporting'];
export type IAnnouncementBarSettings = IVersionedTypes['IWidgetsSettingsAssoc']['announcement-bar'];

export type IBalanceFormSettings = IVersionedTypes['IWidgetsFormSettingsAssoc']['balance'];
export type IExchangeRatesFormSettings = IVersionedTypes['IWidgetsFormSettingsAssoc']['exchange-rates'];
export type IOrderListFormSettings = IVersionedTypes['IWidgetsFormSettingsAssoc']['order-list'];
export type IOrderHistoryFormSettings = IVersionedTypes['IWidgetsFormSettingsAssoc']['order-history'];
export type IChatFormSettings = IVersionedTypes['IWidgetsFormSettingsAssoc']['chat'];
export type IStockChartFormSettings = IVersionedTypes['IWidgetsFormSettingsAssoc']['chart'];
export type IOrderBookFormSettings = IVersionedTypes['IWidgetsFormSettingsAssoc']['order-book'];
export type ITradeHistoryFormSettings = IVersionedTypes['IWidgetsFormSettingsAssoc']['trade-history'];
export type IPlaceOrderFormSettings = IVersionedTypes['IWidgetsFormSettingsAssoc']['place-order'];
export type IOperationHistoryFormSettings = IVersionedTypes['IWidgetsFormSettingsAssoc']['operation-history'];
export type IReportingFormSettings = IVersionedTypes['IWidgetsFormSettingsAssoc']['reporting'];
export type IAnnouncementBarFormSettings = IVersionedTypes['IWidgetsFormSettingsAssoc']['announcement-bar'];
