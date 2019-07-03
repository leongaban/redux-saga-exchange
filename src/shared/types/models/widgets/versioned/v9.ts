import { Omit, IHoldingVersion } from 'shared/types/app';
import { IHoldingSortInfo } from 'shared/types/ui';

import { IOperationHistoryColumnData } from '../../operationHistory';
import { IGenericVersionedTypes, GetSettings, GetSettingsAssoc } from '../helpers';
import * as V8 from './v8';

interface IReportingSettings extends GetSettings<V8.IVersionedTypes, 'reporting'> {
  operationHistory: IHoldingSortInfo<IOperationHistoryColumnData>;
}

interface IWidgetsSettingsAssoc extends Omit<GetSettingsAssoc<V8.IVersionedTypes>, 'reporting'> {
  'reporting': IReportingSettings;
}

export type IVersionedTypes = IGenericVersionedTypes<
  V8.IVersionedTypes['WidgetKind'],
  IWidgetsSettingsAssoc,
  V8.IVersionedTypes['IWidgetsFormSettingsAssoc']
  >;

export interface IUserConfig extends Omit<V8.IUserConfig, 'version'>, IHoldingVersion<9> {
  presets: Array<IVersionedTypes['IPreset']>;
}
