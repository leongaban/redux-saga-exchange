import * as NS from '../../namespace';
import initial from '../data/initial';

function editReducer(state: NS.IReduxState['edit'] = initial.edit, action: NS.Action): NS.IReduxState['edit'] {
  switch (action.type) {
    case 'CONFIG:SET_CURRENT_PRESETS_LAYOUTS':
      return {
        ...state,
        currentPresetsLayouts: action.payload,
      };
    case 'CONFIG:SET_PRESETS_HAVE_UNSAVED_CHANGES': {
      return {
        ...state,
        presetsHaveUnsavedChanges: action.payload,
      };
    }
    case 'CONFIG:M:SET_CURRENT_CURRENCY_PAIR_ID': {
      return {
        ...state,
        mobile: {
          currentCurrencyPairID: action.payload,
        },
      };
    }

    default: return state;
  }
}

export default editReducer;
