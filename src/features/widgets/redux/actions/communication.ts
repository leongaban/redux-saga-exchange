import { makeCommunicationActionCreators } from 'shared/helpers/redux';
import * as NS from '../../namespace';

// tslint:disable:max-line-length
export const { execute: addPreset, completed: addPresetCompleted, failed: addPresetFailed } =
  makeCommunicationActionCreators<NS.IAddPreset, NS.IAddPresetCompleted, NS.IAddPresetFailed>(
    'WIDGETS:ADD_PRESET', 'WIDGETS:ADD_PRESET_COMPLETED', 'WIDGETS:ADD_PRESET_FAILED',
  );

export const { execute: setPresets, completed: setPresetsCompleted, failed: setPresetsFailed } =
  makeCommunicationActionCreators<NS.ISetPresets, NS.ISetPresetsCompleted, NS.ISetPresetsFailed>(
    'WIDGETS:SET_PRESETS', 'WIDGETS:SET_PRESETS_COMPLETED', 'WIDGETS:SET_PRESETS_FAILED',
  );

export const { execute: setWidgetSettings, completed: setWidgetSettingsCompleted, failed: setWidgetSettingsFailed } =
  makeCommunicationActionCreators<NS.ISetWidgetSettings, NS.ISetWidgetSettingsCompleted, NS.ISetWidgetSettingsFailed>(
    'WIDGETS:SET_WIDGET_SETTINGS', 'WIDGETS:SET_WIDGET_SETTINGS_COMPLETED', 'WIDGETS:SET_WIDGET_SETTINGS_FAILED',
  );

export const { execute: removeWidget, completed: removeWidgetCompleted, failed: removeWidgetFailed } =
  makeCommunicationActionCreators<NS.IRemoveWidget, NS.IRemoveWidgetCompleted, NS.IRemoveWidgetFailed>(
    'WIDGETS:REMOVE_WIDGET', 'WIDGETS:REMOVE_WIDGET_COMPLETED', 'WIDGETS:REMOVE_WIDGET_FAILED',
  );

export const { execute: addWidget, completed: addWidgetCompleted, failed: addWidgetFailed } =
  makeCommunicationActionCreators<NS.IAddWidget, NS.IAddWidgetCompleted, NS.IAddWidgetFailed>(
    'WIDGETS:ADD_WIDGET', 'WIDGETS:ADD_WIDGET_COMPLETED', 'WIDGETS:ADD_WIDGET_FAILED',
  );
