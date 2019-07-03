import { Omit, IHoldingVersion } from 'shared/types/app';

import {
  IGenericVersionedTypes, GetSettingsAssoc, GetFormSettingsAssoc, GetSettings, GetFormSettings,
} from '../helpers';
import * as V7 from './v7';

interface IOrderBookFormSettings extends GetFormSettings<V7.IVersionedTypes, 'order-book'> {
  depthView: boolean;
}

interface IOrderBookSettings extends GetSettings<V7.IVersionedTypes, 'order-book'>, IOrderBookFormSettings { }

interface IWidgetsSettingsAssoc extends Omit<GetSettingsAssoc<V7.IVersionedTypes>, 'order-book'> {
  'order-book': IOrderBookSettings;
}

interface IWidgetsFormSettingsAssoc extends Omit<GetFormSettingsAssoc<V7.IVersionedTypes>, 'order-book'> {
  'order-book': IOrderBookSettings;
}

export type IVersionedTypes = IGenericVersionedTypes<
  V7.IVersionedTypes['WidgetKind'],
  IWidgetsSettingsAssoc,
  IWidgetsFormSettingsAssoc
  >;

export interface IUserConfig extends Omit<V7.IUserConfig, 'version'>, IHoldingVersion<8> {
  presets: Array<IVersionedTypes['IPreset']>;
}
