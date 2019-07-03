import { Omit, IHoldingVersion } from 'shared/types/app';

import { SidesDisplayMethod } from '../../placeOrder';
import { IGenericVersionedTypes, GetSettingsAssoc, GetFormSettingsAssoc } from '../helpers';
import * as V1 from './v1';

interface IPlaceOrderFormSettings {
  sidesDisplayMethod: SidesDisplayMethod;
}

type IPlaceOrderSettings = IPlaceOrderFormSettings;

interface IWidgetsSettingsAssoc extends Omit<GetSettingsAssoc<V1.IVersionedTypes>, 'place-order'> {
  'place-order': IPlaceOrderSettings;
}

interface IWidgetsFormSettingsAssoc extends Omit<GetFormSettingsAssoc<V1.IVersionedTypes>, 'place-order'> {
  'place-order': IPlaceOrderFormSettings;
}

export type IVersionedTypes = IGenericVersionedTypes<
  V1.IVersionedTypes['WidgetKind'],
  IWidgetsSettingsAssoc,
  IWidgetsFormSettingsAssoc
  >;

export interface IUserConfig extends Omit<V1.IUserConfig, 'presets' | 'version'>, IHoldingVersion<2> {
  presets: Array<IVersionedTypes['IPreset']>;
}
