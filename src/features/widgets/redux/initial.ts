import { initialCommunicationField } from 'shared/helpers/redux';
import * as NS from '../namespace';

export const initial: NS.IReduxState = {
  communication: {
    addPreset: initialCommunicationField,
    setPresets: initialCommunicationField,
    setWidgetSettings: initialCommunicationField,
    removeWidget: initialCommunicationField,
    addWidget: initialCommunicationField,
  },
  ui: {
    modals: {
      managePresets: {
        isOpen: false,
      },
      newPresetDialog: {
        isOpen: false,
      },
      addWidgetDialog: {
        isOpen: false,
      },
      settingsDialog: {
        isOpen: false,
      },
    },
  },
};
