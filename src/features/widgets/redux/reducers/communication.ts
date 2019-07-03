import { combineReducers } from 'redux';
import { makeCommunicationReducer } from 'shared/helpers/redux';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';

import { initial } from '../initial';

export const communicationReducer = combineReducers<NS.IReduxState['communication']>({

  addPreset: makeCommunicationReducer<NS.IAddPreset, NS.IAddPresetCompleted, NS.IAddPresetFailed>(
    'WIDGETS:ADD_PRESET',
    'WIDGETS:ADD_PRESET_COMPLETED',
    'WIDGETS:ADD_PRESET_FAILED',
    initial.communication.addPreset,
  ),

  setPresets: makeCommunicationReducer<NS.ISetPresets, NS.ISetPresetsCompleted, NS.ISetPresetsFailed>(
    'WIDGETS:SET_PRESETS',
    'WIDGETS:SET_PRESETS_COMPLETED',
    'WIDGETS:SET_PRESETS_FAILED',
    initial.communication.setPresets,
  ),

  setWidgetSettings: makeCommunicationReducer<
    NS.ISetWidgetSettings,
    NS.ISetWidgetSettingsCompleted,
    NS.ISetWidgetSettingsFailed
    >(
    'WIDGETS:SET_WIDGET_SETTINGS',
    'WIDGETS:SET_WIDGET_SETTINGS_COMPLETED',
    'WIDGETS:SET_WIDGET_SETTINGS_FAILED',
    initial.communication.setWidgetSettings,
  ),

  removeWidget: makeCommunicationReducer<NS.IRemoveWidget, NS.IRemoveWidgetCompleted, NS.IRemoveWidgetFailed>(
    'WIDGETS:REMOVE_WIDGET',
    'WIDGETS:REMOVE_WIDGET_COMPLETED',
    'WIDGETS:REMOVE_WIDGET_FAILED',
    initial.communication.removeWidget,
  ),

  addWidget: makeCommunicationReducer<NS.IAddWidget, NS.IAddWidgetCompleted, NS.IAddWidgetFailed>(
    'WIDGETS:ADD_WIDGET',
    'WIDGETS:ADD_WIDGET_COMPLETED',
    'WIDGETS:ADD_WIDGET_FAILED',
    initial.communication.addWidget,
  ),

} as ReducersMap<NS.IReduxState['communication']>);
