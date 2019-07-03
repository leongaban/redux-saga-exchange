import { initialCommunicationField } from 'shared/helpers/redux';
import { IReduxState } from '../../namespace';

export const initial: IReduxState = {
  communication: {
    placeOrder: initialCommunicationField,
  },
  edit: {
    placeOrderForms: {
      placeBuyOrderForm: { volumeSliderValue: 0 },
      placeSellOrderForm: { volumeSliderValue: 0 },
      placeBuyOrderModalForm: { volumeSliderValue: 0 },
      placeSellOrderModalForm: { volumeSliderValue: 0 },
    },
    isBuyFormPriceUpdateEnabled: true,
    isSellFormPriceUpdateEnabled: true,
    selectedOrderType: 'Limit',
  },
  ui: {
    placeOrderModal: { isOpen: false },
    singlePlaceOrderForms: {
      modal: {
        orderSide: 'buy',
        orderType: 'Limit',
      },
      widget: {
        orderSide: 'buy',
        orderType: 'Limit',
      },
    },
  },
};
