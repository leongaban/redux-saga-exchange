import { Omit, IHoldingVersion } from 'shared/types/app';

import { IReportsSettings } from '../shared';
import {
  IGenericVersionedTypes, GetSettingsAssoc, GetFormSettingsAssoc, GetSettings, GetFormSettings,
} from '../helpers';
import * as V2 from './v2';

interface IOrderListFormSettings extends GetFormSettings<V2.IVersionedTypes, 'order-list'> {
  shouldOpenCancelOrderModal: boolean;
}

interface IOrderListSettings extends GetSettings<V2.IVersionedTypes, 'order-list'>, IOrderListFormSettings { }

interface IWidgetsSettingsAssoc extends Omit<GetSettingsAssoc<V2.IVersionedTypes>, 'order-list'> {
  'order-list': IOrderListSettings;
}

interface IWidgetsFormSettingsAssoc extends Omit<GetFormSettingsAssoc<V2.IVersionedTypes>, 'order-list'> {
  'order-list': IOrderListFormSettings;
}

export type IVersionedTypes = IGenericVersionedTypes<
  V2.IVersionedTypes['WidgetKind'],
  IWidgetsSettingsAssoc,
  IWidgetsFormSettingsAssoc
  >;

export interface IUserConfig extends Omit<V2.IUserConfig, 'presets' | 'version'>, IHoldingVersion<3> {
  presets: Array<IVersionedTypes['IPreset']>;
  reportsSettings: IReportsSettings;
}
