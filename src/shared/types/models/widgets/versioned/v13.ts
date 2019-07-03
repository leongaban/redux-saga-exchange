import { Omit, IHoldingVersion } from 'shared/types/app';

import { IGenericVersionedTypes, GetFormSettingsAssoc, GetSettingsAssoc } from '../helpers';
import * as v12 from './v12';

type WidgetKind =
  v12.IVersionedTypes['WidgetKind']
  | 'announcement-bar';

interface IWidgetsSettingsAssoc extends GetSettingsAssoc<v12.IVersionedTypes> {
  'announcement-bar': null;
}

interface IWidgetsFormSettingsAssoc extends GetFormSettingsAssoc<v12.IVersionedTypes> {
  'announcement-bar': null;
}

export type IVersionedTypes = IGenericVersionedTypes<
  WidgetKind,
  IWidgetsSettingsAssoc,
  IWidgetsFormSettingsAssoc
  >;

export interface IUserConfig extends Omit<v12.IUserConfig, 'version' | 'presets'>, IHoldingVersion<13> {
  presets: Array<IVersionedTypes['IPreset']>;
}
