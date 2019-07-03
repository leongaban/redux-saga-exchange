import * as NS from '../../namespace';
import { OrderType, ICopyOrderToWidgetPayload, ICopyOrderToModalPayload } from 'shared/types/models';

export function copyOrderToModal(order: ICopyOrderToModalPayload): NS.ICopyOrderToModal {
  return { type: 'PLACE_ORDER:COPY_ORDER_TO_MODAL', payload: order };
}

export function copyOrderToWidget(order: ICopyOrderToWidgetPayload): NS.ICopyOrderToWidget {
  return { type: 'PLACE_ORDER:COPY_ORDER_TO_WIDGET', payload: order };
}

export function setVolumeSliderValue(payload: NS.ISetVolumeSliderValuePayload): NS.ISetVolumeSliderValue {
  return { type: 'PLACE_ORDER:SET_VOLUME_SLIDER_VALUE', payload };
}

export function setSelectedOrderType(payload: OrderType): NS.ISetSelectedOrderType {
  return { type: 'PLACE_ORDER:SET_SELECTED_ORDER_TYPE', payload };
}

export function resetForm(formName: NS.PlaceOrderFormName): NS.IResetForm {
  return { type: 'PLACE_ORDER:RESET_FORM', payload: formName };
}

export function reset(): NS.IReset {
  return { type: 'PLACE_ORDER:RESET' };
}

export function setFormPriceUpdate(payload: NS.ISetFormPriceUpdatePayload): NS.ISetFormPriceUpdate {
  return { type: 'PLACE_ORDER:SET_FORM_PRICE_UPDATE', payload };
}
