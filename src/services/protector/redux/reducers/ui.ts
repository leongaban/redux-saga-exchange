import * as NS from '../../namespace';
import initial from '../data/initial';

function uiReducer(state: NS.IReduxState['ui'] = initial.ui, action: NS.Action): NS.IReduxState['ui'] {
  switch (action.type) {
    case 'PROTECTOR:TOGGLE_VERIFICATION_MODAL_STATE': {
      return {
        ...state,
        isVerificationModalOpen: !state.isVerificationModalOpen,
      };
    }
    default: {
      return state;
    }
  }
}

export default uiReducer;
