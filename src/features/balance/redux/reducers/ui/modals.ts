import * as NS from '../../../namespace';
import { initial } from '../../initial';

export function modalsReducer(
  state: NS.IReduxState['ui']['modals'] = initial.ui.modals,
  action: NS.Action,
): NS.IReduxState['ui']['modals'] {
  switch (action.type) {
    case 'BALANCE:LOAD_DEPOSIT_ADDRESS_COMPLETED':
      return {
        ...state,
        depositCoins: {
          ...state.depositCoins,
          address: action.payload,
        },
      };

    case 'BALANCE:SET_MODAL_PROPS': {
      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          ...action.payload.props,
        },
      };
    }

    default: return state;
  }
}
