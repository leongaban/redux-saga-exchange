import * as NS from '../../namespace';
import { initial } from '../data/initial';

function uiReducer(state: NS.IReduxState['ui'] = initial.ui, action: NS.Action): NS.IReduxState['ui'] {
  switch (action.type) {
    case 'PLACE_ORDER:SET_PLACE_ORDER_MODAL':
      return {
        ...state,
        placeOrderModal: {
          ...state.placeOrderModal,
          ...action.payload,
        },
      };

    case 'PLACE_ORDER:SET_SINGLE_PLACE_ORDER_FORM':
      return {
        ...state,
        singlePlaceOrderForms: {
          ...state.singlePlaceOrderForms,
          [action.payload.formKind]: {
            ...state.singlePlaceOrderForms[action.payload.formKind],
            ...action.payload.placeOrderFormData,
          },
        },
      };

    default: return state;
  }
}

export default uiReducer;
