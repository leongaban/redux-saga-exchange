import { Omit, IHoldingVersion } from 'shared/types/app';
import { IHoldingSortInfo } from 'shared/types/ui';

import { ReportingContentKind } from '../../reporting';
import { IActiveOrderColumnData, IArchiveOrderColumnData, IHoldingHideOtherPairs } from '../../orders';
import { IGenericVersionedTypes, GetSettingsAssoc, GetFormSettingsAssoc, GetFormSettings } from '../helpers';
import * as V5 from './v5';

type WidgetKind =
  V5.IVersionedTypes['WidgetKind']
  | 'reporting';

interface IReportingFormSettings {
  orderList: GetFormSettings<V5.IVersionedTypes, 'order-list'>;
  orderHistory: GetFormSettings<V5.IVersionedTypes, 'order-history'>;
}

interface IReportingSettings extends IReportingFormSettings, IHoldingHideOtherPairs {
  orderList: IReportingFormSettings['orderList'] & IHoldingSortInfo<IActiveOrderColumnData>;
  orderHistory: IReportingFormSettings['orderHistory'] & IHoldingSortInfo<IArchiveOrderColumnData>;
  activeReportingContentKind: ReportingContentKind;
}

interface IWidgetsSettingsAssoc extends GetSettingsAssoc<V5.IVersionedTypes> {
  'reporting': IReportingSettings;
}

interface IWidgetsFormSettingsAssoc extends GetFormSettingsAssoc<V5.IVersionedTypes> {
  'reporting': IReportingFormSettings;
}

export type IVersionedTypes = IGenericVersionedTypes<
  WidgetKind,
  IWidgetsSettingsAssoc,
  IWidgetsFormSettingsAssoc
  >;

export interface IUserConfig extends Omit<V5.IUserConfig, 'version' | 'presets'>, IHoldingVersion<6> {
  presets: Array<IVersionedTypes['IPreset']>;
}
