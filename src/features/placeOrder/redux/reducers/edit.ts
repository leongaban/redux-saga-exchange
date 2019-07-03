import * as NS from '../../namespace';
import { initial } from '../data/initial';

function editReducer(state: NS.IReduxState['edit'] = initial.edit, action: NS.Action): NS.IReduxState['edit'] {
  switch (action.type) {
    case 'PLACE_ORDER:SET_VOLUME_SLIDER_VALUE': {
      const { form, value } = action.payload;

      const newFormState: NS.IPlaceOrderLocalFormState = {
        ...state.placeOrderForms[form],
        volumeSliderValue: value,
      };

      return {
        ...state,
        placeOrderForms: {
          ...state.placeOrderForms,
          [form]: newFormState,
        },
      };
    }

    case 'PLACE_ORDER:SET_FORM_PRICE_UPDATE':
      if (action.payload.formType === 'buy') {
        return {
          ...state,
          isBuyFormPriceUpdateEnabled: action.payload.isPriceUpdateEnabled,
        };
      } else {
        return {
          ...state,
          isSellFormPriceUpdateEnabled: action.payload.isPriceUpdateEnabled,
        };
      }

    case 'PLACE_ORDER:SET_SELECTED_ORDER_TYPE':
      return {
        ...state,
        selectedOrderType: action.payload,
      };

    default: return state;
  }
}

export default editReducer;
