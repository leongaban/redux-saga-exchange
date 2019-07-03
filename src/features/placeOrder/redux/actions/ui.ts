import * as NS from '../../namespace';

export function setPlaceOrderModal(payload: Partial<NS.IPlaceOrderModal>): NS.ISetPlaceOrderModal {
  return { type: 'PLACE_ORDER:SET_PLACE_ORDER_MODAL', payload };
}

export function setSinglePlaceOrderForm(payload: NS.ISetSinglePlaceOrderFormPayload): NS.ISetSinglePlaceOrderForm {
  return { type: 'PLACE_ORDER:SET_SINGLE_PLACE_ORDER_FORM', payload };
}
