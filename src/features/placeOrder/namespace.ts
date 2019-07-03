import { ICommunication, IPlainAction, IAction, IPlainFailAction } from 'shared/types/redux';

import {
  IChartItem, OrderType, OrderSide, ITradeOrder, ICopyOrderToWidgetPayload, ICopyOrderToModalPayload,
} from 'shared/types/models';
import { IPlaceOrderRequest } from 'shared/types/requests';

import {
  placeBuyOrderFormEntry,
  placeSellOrderFormEntry,
  placeBuyOrderModalFormEntry,
  placeSellOrderModalFormEntry,
} from './redux/data/reduxFormEntries';
import { IClosable } from 'shared/types/ui';

export interface IReduxState {
  communication: {
    placeOrder: ICommunication;
  };
  edit: {
    placeOrderForms: { [x in PlaceOrderFormName]: IPlaceOrderLocalFormState };
    isBuyFormPriceUpdateEnabled: boolean;
    isSellFormPriceUpdateEnabled: boolean;
    selectedOrderType: OrderType;
  };
  ui: {
    placeOrderModal: IPlaceOrderModal;
    singlePlaceOrderForms: Record<SinglePlaceOrderFormKind, ISinglePlaceOrderForm>
  };
}

export type SinglePlaceOrderFormKind = 'modal' | 'widget';

export type FeeType = 'taker' | 'maker';
export type PurchasedAssetVolume = Record<FeeType, number>;

export type IPlaceOrderModal = IClosable;

export interface ISinglePlaceOrderForm {
  orderSide: OrderSide;
  orderType: OrderType;
}

export interface IPlaceOrderForm extends IPlaceOrderRequest {
  formName: PlaceOrderFormName;
}

export type FormType = 'buy' | 'sell';

export interface ISetFormPriceUpdatePayload {
  formType: OrderSide;
  isPriceUpdateEnabled: boolean;
}

export interface ISetVolumeSliderValuePayload {
  form: PlaceOrderFormName;
  value: number;
}

// form state that is not handled by redux-form
export interface IPlaceOrderLocalFormState {
  volumeSliderValue: number;
}

export interface ICommonCalculateVolumeOptions {
  orderType: OrderType;
  baseCurrencyBalance: number;
  counterCurrencyBalance: number;
  askOrders: ITradeOrder[];
}

export interface ICalculateVolumeOptions {
  formType: OrderSide;
  price?: string;
  baseCurrencyBalance: number;
  counterCurrencyBalance: number;
  orderType: OrderType;
  askOrders: ITradeOrder[];
  balancePercentage: number;
}

export interface ISetSinglePlaceOrderFormPayload {
  formKind: SinglePlaceOrderFormKind;
  placeOrderFormData: Partial<ISinglePlaceOrderForm>;
}

export type PlaceOrderFormName =
  | typeof placeBuyOrderFormEntry['name']
  | typeof placeSellOrderFormEntry['name']
  | typeof placeBuyOrderModalFormEntry['name']
  | typeof placeSellOrderModalFormEntry['name'];

export type IPlaceOrder = IAction<'PLACE_ORDER:PLACE_ORDER', IPlaceOrderForm>;
export type IPlaceOrderCompleted = IPlainAction<'PLACE_ORDER:PLACE_ORDER_COMPLETED'>;
export type IPlaceOrderFailed = IPlainFailAction<'PLACE_ORDER:PLACE_ORDER_FAILED'>;

export type ICopyOrderToModal = IAction<'PLACE_ORDER:COPY_ORDER_TO_MODAL', ICopyOrderToModalPayload>;
export type ICopyOrderToWidget = IAction<'PLACE_ORDER:COPY_ORDER_TO_WIDGET', ICopyOrderToWidgetPayload>;

export type ISetCurrentCandle = IAction<'PLACE_ORDER:SET_CURRENT_CANDLE', IChartItem>;

export type ISetVolumeSliderValue = IAction<'PLACE_ORDER:SET_VOLUME_SLIDER_VALUE', ISetVolumeSliderValuePayload>;

export type ISetSelectedOrderType = IAction<'PLACE_ORDER:SET_SELECTED_ORDER_TYPE', OrderType>;

export type IResetForm = IAction<'PLACE_ORDER:RESET_FORM', PlaceOrderFormName>;
export type IReset = IPlainAction<'PLACE_ORDER:RESET'>;

export type ISetFormPriceUpdate = IAction<'PLACE_ORDER:SET_FORM_PRICE_UPDATE', ISetFormPriceUpdatePayload>;

export type ISetPlaceOrderModal = IAction<'PLACE_ORDER:SET_PLACE_ORDER_MODAL', Partial<IPlaceOrderModal>>;
export type ISetSinglePlaceOrderForm =
  IAction<'PLACE_ORDER:SET_SINGLE_PLACE_ORDER_FORM', ISetSinglePlaceOrderFormPayload>;

export type Action =
  | IPlaceOrder | IPlaceOrderCompleted | IPlaceOrderFailed
  | ICopyOrderToModal | ISetCurrentCandle | ISetVolumeSliderValue | ISetPlaceOrderModal
  | ISetSelectedOrderType | IReset | ISetFormPriceUpdate | ISetSinglePlaceOrderForm;
