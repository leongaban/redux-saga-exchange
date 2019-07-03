import { Omit, IHoldingVersion } from 'shared/types/app';
import { BarStyle, CandlesticksChartKind } from '../shared';
import { IGenericVersionedTypes, GetSettingsAssoc, GetSettings } from '../helpers';
import * as V4 from './v4';

interface IStockChartSettings extends GetSettings<V4.IVersionedTypes, 'chart'> {
  candlesticksChartKind: CandlesticksChartKind;
  tvIndicators: string[];
  barStyle: BarStyle;
}

interface IWidgetsSettingsAssoc extends Omit<GetSettingsAssoc<V4.IVersionedTypes>, 'chart'> {
  'chart': IStockChartSettings;
}

export type IVersionedTypes = IGenericVersionedTypes<
  V4.IVersionedTypes['WidgetKind'],
  IWidgetsSettingsAssoc,
  V4.IVersionedTypes['IWidgetsFormSettingsAssoc']
  >;

export interface IUserConfig extends Omit<V4.IUserConfig, 'presets' | 'version'>, IHoldingVersion<5> {
  presets: Array<IVersionedTypes['IPreset']>;
}
