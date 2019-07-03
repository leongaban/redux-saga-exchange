import { Omit, IHoldingVersion } from 'shared/types/app';

import { IExchangeRatesVisibleColumns } from '../../exchangeRates';
import { IGenericVersionedTypes, GetSettingsAssoc, GetFormSettingsAssoc, GetSettings } from '../helpers';
import * as V3 from './v3';

type IExchangeRatesFormSettings = IExchangeRatesVisibleColumns;

interface IExchangeRatesSettings extends
  GetSettings<V3.IVersionedTypes, 'exchange-rates'>, IExchangeRatesFormSettings { }

interface IWidgetsSettingsAssoc extends Omit<GetSettingsAssoc<V3.IVersionedTypes>, 'exchange-rates'> {
  'exchange-rates': IExchangeRatesSettings;
}

interface IWidgetsFormSettingsAssoc extends Omit<GetFormSettingsAssoc<V3.IVersionedTypes>, 'exchange-rates'> {
  'exchange-rates': IExchangeRatesFormSettings;
}

export type IVersionedTypes = IGenericVersionedTypes<
  V3.IVersionedTypes['WidgetKind'],
  IWidgetsSettingsAssoc,
  IWidgetsFormSettingsAssoc
  >;

export interface IUserConfig extends Omit<V3.IUserConfig, 'version' | 'presets'>, IHoldingVersion<4> {
  presets: Array<IVersionedTypes['IPreset']>;
}
