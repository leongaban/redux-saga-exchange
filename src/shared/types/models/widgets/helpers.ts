import {
  WidgetsSettingsDictionaries, IGenericPreset, IGenericPresetLayouts, IGenericWidgetLayout,
  IGenericResponsiveLayouts, IGenericPartialResponsiveLayouts, IGenericRawWidgetLayout,
} from './shared';

interface IGenericVersionedTypesInternal<
  WidgetKind extends string,
  WidgetsSettingsAssoc extends Record<WidgetKind, WidgetsSettingsAssoc[keyof WidgetsSettingsAssoc]>,
  WidgetsFormSettingsAssoc extends Record<WidgetKind, WidgetsFormSettingsAssoc[keyof WidgetsFormSettingsAssoc]>,
  WidgetsSettings = WidgetsSettingsDictionaries<
  WidgetKind,
  WidgetsSettingsAssoc[keyof WidgetsSettingsAssoc],
  WidgetsSettingsAssoc
  >> {
  WidgetKind: WidgetKind;
  IWidgetsSettingsAssoc: WidgetsSettingsAssoc;
  IWidgetsFormSettingsAssoc: WidgetsFormSettingsAssoc;
  WidgetSettings: WidgetsSettingsAssoc[keyof WidgetsSettingsAssoc];
  WidgetFormSettings: WidgetsFormSettingsAssoc[keyof WidgetsFormSettingsAssoc];
  // TODO imporove WidgetsSettingsDictionaries
  WidgetsSettings: WidgetsSettings;
  IPreset: IGenericPreset<WidgetKind, WidgetsSettings>;
  IPresetLayouts: IGenericPresetLayouts<WidgetKind>;
  IWidgetLayout: IGenericWidgetLayout<WidgetKind>;
  IRawWidgetLayout: IGenericRawWidgetLayout<WidgetKind>;
  IResponsiveLayouts: IGenericResponsiveLayouts<WidgetKind>;
  IPartialResponsiveLayouts: IGenericPartialResponsiveLayouts<WidgetKind>;
}

export type IGenericVersionedTypes<
  WidgetKind extends string,
  WidgetsSettingsAssoc extends Record<WidgetKind, WidgetsSettingsAssoc[keyof WidgetsSettingsAssoc]>,
  WidgetsFormSettingsAssoc extends Record<WidgetKind, WidgetsFormSettingsAssoc[keyof WidgetsFormSettingsAssoc]>
  >
  = IGenericVersionedTypesInternal<WidgetKind, WidgetsSettingsAssoc, WidgetsFormSettingsAssoc>;

export type GetSettings<VersionedTypes extends {
  IWidgetsSettingsAssoc:
  Record<WidgetKind, VersionedTypes['IWidgetsSettingsAssoc'][keyof VersionedTypes['IWidgetsSettingsAssoc']]>
}, WidgetKind extends keyof VersionedTypes['IWidgetsSettingsAssoc']> =
  VersionedTypes['IWidgetsSettingsAssoc'][WidgetKind];

export type GetFormSettings<VersionedTypes extends {
  IWidgetsFormSettingsAssoc:
  Record<WidgetKind, VersionedTypes['IWidgetsFormSettingsAssoc'][keyof VersionedTypes['IWidgetsFormSettingsAssoc']]>
}, WidgetKind extends keyof VersionedTypes['IWidgetsFormSettingsAssoc']> =
  VersionedTypes['IWidgetsFormSettingsAssoc'][WidgetKind];

export type GetSettingsAssoc<VersionedTypes> =
  VersionedTypes extends IGenericVersionedTypes<infer A, infer WidgetsSettingsAssoc, infer B>
  ? WidgetsSettingsAssoc
  : never;

export type GetFormSettingsAssoc<VersionedTypes> =
  VersionedTypes extends IGenericVersionedTypes<infer A, infer B, infer WidgetsFormSettingsAssoc>
  ? WidgetsFormSettingsAssoc
  : never;
