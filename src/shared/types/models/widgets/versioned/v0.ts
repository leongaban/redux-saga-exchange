import { UITheme, IHoldingSortInfo } from 'shared/types/ui';

import { IndicatorType } from '../../../../helpers/indicatorFactory';
import {
  IActiveOrderColumnData, IArchiveOrderColumnData, IOrderListVisibleColumns, IOrderHistoryVisibleColumns,
  IHoldingHideOtherPairs,
} from '../../orders';
import { IOperationHistoryColumnData } from '../../operationHistory';
import { ITradeHistoryColumnData } from '../../tradeHistory';
import { IExchangeRateColumnData } from '../../exchangeRates';
import { ChartContentType, PeriodicityUnit } from '../shared';
import { IGenericVersionedTypes } from '../helpers';

type WidgetKind =
  | 'balance'
  | 'exchange-rates'
  | 'order-list'
  | 'order-history'
  | 'chat'
  | 'order-book'
  | 'chart'
  | 'trade-history'
  | 'place-order'
  | 'operation-history';

type IOrderListFormSettings = IOrderListVisibleColumns;
type IOrderHistoryFormSettings = IOrderHistoryVisibleColumns;

interface IOrderListSettings extends IOrderListFormSettings,
  IHoldingSortInfo<IActiveOrderColumnData>, IHoldingHideOtherPairs { }

interface IOrderHistorySettings extends IOrderHistoryFormSettings,
  IHoldingSortInfo<IArchiveOrderColumnData>, IHoldingHideOtherPairs { }

interface IBalanceFormSettings {
  currencyCodes: string[];
}

type IBalanceSettings = IBalanceFormSettings;

interface IOrderBookSettings {
  decimals: number | null;
}

interface IExchangeRatesSettings extends IHoldingSortInfo<IExchangeRateColumnData> {
  currentMarketId: string;
}

interface IOperationHistorySettings extends IHoldingSortInfo<IOperationHistoryColumnData> { }

interface ITradeHistorySettings extends IHoldingSortInfo<ITradeHistoryColumnData> { }

interface IStockChartFormSettings {
  isZoomEnabled: boolean;
}

interface IStockChartSettings extends IStockChartFormSettings {
  indicators: IndicatorType[];
  interval: number;
  periodicity: PeriodicityUnit;
  contentType: ChartContentType;
}

interface IWidgetsSettingsAssoc {
  'balance': IBalanceSettings;
  'exchange-rates': IExchangeRatesSettings;
  'order-list': IOrderListSettings;
  'order-history': IOrderHistorySettings;
  'chat': null;
  'chart': IStockChartSettings;
  'order-book': IOrderBookSettings;
  'trade-history': ITradeHistorySettings;
  'place-order': null;
  'operation-history': IOperationHistorySettings;
}

interface IWidgetsFormSettingsAssoc {
  'balance': IBalanceFormSettings;
  'exchange-rates': null;
  'order-list': IOrderListFormSettings;
  'order-history': IOrderHistoryFormSettings;
  'chat': null;
  'chart': IStockChartFormSettings;
  'order-book': null;
  'trade-history': null;
  'place-order': null;
  'operation-history': null;
}

export type IVersionedTypes = IGenericVersionedTypes<WidgetKind, IWidgetsSettingsAssoc, IWidgetsFormSettingsAssoc>;

export interface IUserConfig {
  activePresetName: string;
  presets: Array<IVersionedTypes['IPreset']>;
  theme?: UITheme;
  areTOSAccepted?: boolean;
}
