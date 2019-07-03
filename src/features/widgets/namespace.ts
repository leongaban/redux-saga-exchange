import { ICommunication, IPlainAction, IAction, IPlainFailAction } from 'shared/types/redux';
import { IPreset, WidgetKind, WidgetSettings } from 'shared/types/models';
import { ISetWidgetSettingsRequest } from 'shared/types/requests';
import { IClosable } from 'shared/types/ui';

export interface IReduxState {
  communication: {
    setPresets: ICommunication;
    addPreset: ICommunication;
    setWidgetSettings: ICommunication;
    removeWidget: ICommunication;
    addWidget: ICommunication;
  };
  ui: {
    modals: {
      managePresets: IClosable;
      newPresetDialog: IClosable;
      addWidgetDialog: IClosable;
      settingsDialog: IClosable;
    },
  };
}

export interface INewPresetFormData {
  name: string;
}

export interface IManagePresetsFormData {
  presets: IPreset[];
}

export interface IAddPresetFormData {
  name: string;
}

export interface ISetModalDisplayStatusPayload {
  name: keyof IReduxState['ui']['modals'];
  status: boolean;
}

export interface IRemoveWidgetPayload {
  presetName: string;
  widgetUID: string;
}

interface IAddWidgetPayload {
  presetName: string;
  kind: WidgetKind;
  settings: WidgetSettings;
}

export type ISetPresets = IAction<'WIDGETS:SET_PRESETS', IPreset[]>;
export type ISetPresetsCompleted = IPlainAction<'WIDGETS:SET_PRESETS_COMPLETED'>;
export type ISetPresetsFailed = IPlainFailAction<'WIDGETS:SET_PRESETS_FAILED'>;

export type IAddPreset = IAction<'WIDGETS:ADD_PRESET', INewPresetFormData>;
export type IAddPresetCompleted = IPlainAction<'WIDGETS:ADD_PRESET_COMPLETED'>;
export type IAddPresetFailed = IPlainFailAction<'WIDGETS:ADD_PRESET_FAILED'>;

export type IRemoveWidget = IAction<'WIDGETS:REMOVE_WIDGET', IRemoveWidgetPayload>;
export type IRemoveWidgetCompleted = IPlainAction<'WIDGETS:REMOVE_WIDGET_COMPLETED'>;
export type IRemoveWidgetFailed = IPlainFailAction<'WIDGETS:REMOVE_WIDGET_FAILED'>;

export type ISetWidgetSettings = IAction<'WIDGETS:SET_WIDGET_SETTINGS', ISetWidgetSettingsRequest>;
export type ISetWidgetSettingsCompleted = IPlainAction<'WIDGETS:SET_WIDGET_SETTINGS_COMPLETED'>;
export type ISetWidgetSettingsFailed = IPlainFailAction<'WIDGETS:SET_WIDGET_SETTINGS_FAILED'>;

export type IAddWidget = IAction<'WIDGETS:ADD_WIDGET', IAddWidgetPayload>;
export type IAddWidgetCompleted = IPlainAction<'WIDGETS:ADD_WIDGET_COMPLETED'>;
export type IAddWidgetFailed = IPlainFailAction<'WIDGETS:ADD_WIDGET_FAILED'>;

export type ISetModalDisplayStatus = IAction<'WIDGETS:SET_MODAL_DISPLAY_STATUS', ISetModalDisplayStatusPayload>;
export type ISetActivePresetWhenItDoesNotExist = IPlainAction<'WIDGETS:SET_ACTIVE_PRESET_WHEN_IT_DOES_NOT_EXIST'>;

export type IReset = IPlainAction<'WIDGETS:RESET'>;

export type Action =
  | IAddPreset | IAddPresetCompleted | IAddPresetFailed
  | ISetPresets | ISetPresetsCompleted | ISetPresetsFailed
  | ISetWidgetSettings | ISetWidgetSettingsCompleted | ISetWidgetSettingsFailed
  | ISetModalDisplayStatus | ISetActivePresetWhenItDoesNotExist | IReset;
