import initial from '../initial';
import * as NS from '../../namespace';

function uiReducer(state: NS.IReduxState['ui'] = initial.ui, action: NS.Action): NS.IReduxState['ui'] {
  switch (action.type) {
    case 'CHART:SET_MODAL_DISPLAY_STATUS':
      const { name, status } = action.payload;
      return {
        ...state,
        modals: {
          ...state.modals,
          [name]: {
            isOpen: status,
          }
        },
      };
  }
  return state;
}

export { uiReducer };
