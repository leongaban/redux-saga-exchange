import * as R from 'ramda';

import { IGenericPreset, WidgetsSettingsDictionaries, ISettings } from 'shared/types/models/widgets';

type ExtractWidgetSettings<T> = T extends WidgetsSettingsDictionaries<infer A, infer B, infer C> ? B : never;
type ExtractWidgetsAssoc<T> = T extends WidgetsSettingsDictionaries<infer A, infer B, infer C> ? C : never;

export type UpdateWidgetsSettings<
  WidgetsSettings,
  WidgetKind extends string,
  UpdatedWidgetKind extends WidgetKind,
  WidgetSettings,
  WidgetsSettingsAssoc extends Record<WidgetKind, WidgetSettings>,
  NewSettings,
  > = WidgetsSettings extends
  { [k in UpdatedWidgetKind]: ISettings<WidgetsSettingsAssoc[k]> } &
  { [k in Exclude<WidgetKind, UpdatedWidgetKind>]: ISettings<WidgetsSettingsAssoc[k]> }
  ?
  { [k in UpdatedWidgetKind]: ISettings<NewSettings> } &
  { [k in Exclude<WidgetKind, UpdatedWidgetKind>]: ISettings<WidgetsSettingsAssoc[k]> }
  : never;

export function makePresetSettingsMigrator<
  WidgetKind extends string,
  UpdatedWidgetKind extends WidgetKind,
  >(widgetKindToUpdate: UpdatedWidgetKind) {
  return function migratePresetSettings<
    Preset extends IGenericPreset<WidgetKind, WidgetsSettings>,
    NewSettings,
    SettingsAssoc extends Record<WidgetKind, WidgetSettings> = ExtractWidgetsAssoc<Preset['settings']>,
    WidgetsSettings extends WidgetsSettingsDictionaries<WidgetKind, WidgetSettings, SettingsAssoc>
    = Preset['settings'],
    WidgetSettings = ExtractWidgetSettings<Preset['settings']>,
    NewWidgetsSettings
    = UpdateWidgetsSettings<WidgetsSettings, WidgetKind, UpdatedWidgetKind, WidgetSettings, SettingsAssoc, NewSettings>
    >(
      preset: Preset,
      updater: (settings: SettingsAssoc[UpdatedWidgetKind]) => NewSettings,
  ): IGenericPreset<WidgetKind, NewWidgetsSettings> {
    return {
      name: preset.name,
      layouts: preset.layouts,
      settings: {
        ...(preset.settings as any),
        [widgetKindToUpdate]:
          // TODO fix ramda map type to fix following any types
          R.map(updater, preset.settings[widgetKindToUpdate] as any) as any,
      }
      ,
    };
  };
}
