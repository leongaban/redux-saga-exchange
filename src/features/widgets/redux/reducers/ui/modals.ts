import * as NS from '../../../namespace';
import { initial } from '../../initial';

export default function modalsReducer(
  state: NS.IReduxState['ui']['modals'] = initial.ui.modals,
  action: NS.Action,
): NS.IReduxState['ui']['modals'] {
  switch (action.type) {
    case 'WIDGETS:SET_MODAL_DISPLAY_STATUS':
      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          isOpen: action.payload.status,
        },
      };
    case 'WIDGETS:SET_PRESETS_COMPLETED':
      return {
        ...state,
        managePresets: {
          ...state.managePresets,
          isOpen: false,
        },
      };

    case 'WIDGETS:SET_WIDGET_SETTINGS_COMPLETED':
      return {
        ...state,
        addWidgetDialog: {
          ...state.addWidgetDialog,
          isOpen: false,
        },
        settingsDialog: {
          ...state.settingsDialog,
          isOpen: false,
        },
      };

    default:
      return state;
  }
}
