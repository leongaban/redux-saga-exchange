import { Layout, Breakpoints } from 'react-grid-layout';
import { UITheme } from '../../ui';

// TODO refactor versioned models from features
export type ChartKind = 'candlesticks' | 'depth';
export type CandlesticksChartKind = 'trading-view' | 'stockchart-x';
export type ChartContentType = 'chart' | 'market_depth';
export type PeriodicityUnit = 'm' | 'h' | 'd' | 'w' | 'M';
export type ChartPlot = 'OHLC' | 'coloredOHLC' | 'HLC' | 'coloredHLC' | 'HL' | 'coloredHL' | 'candle' |
  'hollowCandle' | 'heikinAshi' | 'renko' | 'lineBreak' | 'pointAndFigure' | 'kagi';

export type BarStyle = 'bar' | 'candle' | 'hollow-candle' | 'heikin-ashi' | 'line' | 'area' | 'baseline';

export interface ISettings<T> {
  [uid: string]: T | undefined;
}

export interface IHoldingWidgetKind<WidgetKind> {
  kind: WidgetKind;
}

export type IGenericResponsiveLayouts<WidgetKind> = { [k in Breakpoints]?: Array<IGenericWidgetLayout<WidgetKind>> };
export type IGenericPartialResponsiveLayouts<WidgetKind> = {
  [k in Breakpoints]?: Array<Partial<IGenericWidgetLayout<WidgetKind>>>
};

export type WidgetsSettingsDictionaries<
  WidgetKind extends string,
  WidgetSettings,
  SettingsAssoc extends Record<WidgetKind, WidgetSettings>
  >
  = { [k in WidgetKind]: ISettings<SettingsAssoc[k]> };

export interface IGenericWidgetLayout<WidgetKind> extends
  Pick<Layout, Exclude<keyof Layout, 'minW' | 'minH'>>,
  Required<Pick<Layout, 'minW' | 'minH'>>,
  IHoldingWidgetKind<WidgetKind> { }

export type IGenericRawWidgetLayout<WidgetKind> =
  Pick<IGenericWidgetLayout<WidgetKind>, Exclude<keyof IGenericWidgetLayout<WidgetKind>, 'w' | 'minW' | 'minH'>>;

export interface IGenericPresetLayouts<WidgetKind> {
  name: string;
  layouts: IGenericResponsiveLayouts<WidgetKind>;
}

export interface IGenericPreset<WidgetKind, WidgetsSettings> extends IGenericPresetLayouts<WidgetKind> {
  settings: WidgetsSettings;
}

export interface IReportsSettings {
  openOrders: {
    shouldOpenCancelOrderModal: boolean;
  };
}

export interface IHoldingTheme {
  theme: UITheme;
}
