import { WidgetKind, WidgetSettings } from '../models';
import { DeepPartial } from '../app';

export interface ISetWidgetSettingsRequest {
  kind: WidgetKind;
  uid: string;
  settingsUpdate: DeepPartial<WidgetSettings>;
}
