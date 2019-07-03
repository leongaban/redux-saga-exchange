import { call, put, takeLatest, all, select } from 'redux-saga/effects';
import { stopSubmit, change } from 'redux-form';
import * as R from 'ramda';

import { IDependencies } from 'shared/types/app';
import { OrderSide, ICurrencyPair } from 'shared/types/models';
import getErrorMsg, { isApiError, getFieldError } from 'shared/helpers/getErrorMsg';
import { actions as notificationActions } from 'services/notification';
import { selectors as configSelectors } from 'services/config';
import { floorFloatToFixed } from 'shared/helpers/number';

import * as actions from '../actions';
import * as NS from '../../namespace';
import * as reduxFormEntries from '../data/reduxFormEntries';
import { calculateVolume } from '../../helpers';
import { makeCommonOptionsForCalculateVolumeSelector } from '../data/selectors';

const {
  placeBuyOrderModalFormEntry, placeSellOrderModalFormEntry, placeBuyOrderFormEntry, placeSellOrderFormEntry,
} = reduxFormEntries;

function getSaga(deps: IDependencies) {
  const placeOrderType: NS.IPlaceOrder['type'] = 'PLACE_ORDER:PLACE_ORDER';
  const copyOrderToModalType: NS.ICopyOrderToModal['type'] = 'PLACE_ORDER:COPY_ORDER_TO_MODAL';
  const copyOrderToWidgetType: NS.ICopyOrderToWidget['type'] = 'PLACE_ORDER:COPY_ORDER_TO_WIDGET';
  const resetFormType: NS.IResetForm['type'] = 'PLACE_ORDER:RESET_FORM';

  return function* saga() {
    yield all([
      takeLatest(placeOrderType, executePlaceOrder, deps),
      takeLatest(copyOrderToModalType, executeCopyOrderToModal),
      takeLatest(copyOrderToWidgetType, executeCopyOrderToWidget),
      takeLatest(resetFormType, executeResetForm),
    ]);
  };
}

function* executePlaceOrder({ api }: IDependencies, { payload }: NS.IPlaceOrder) {
  try {
    yield call(api.orders.placeOrder, payload);
    yield put(actions.placeOrderCompleted());
    yield put(notificationActions.setNotification({ kind: 'info', text: 'Order successfully created!' }));
    yield put(actions.setFormPriceUpdate({ formType: payload.orderSide, isPriceUpdateEnabled: true }));
    yield put(actions.resetForm(payload.formName));
  } catch (error) {
    if (isApiError(error)) {
      const getError = R.curry(getFieldError)(error.errors);
      yield put(stopSubmit(payload.formName, { _error: getError(R.T) }));
    } else {
      yield put(notificationActions.setNotification({ kind: 'error', text: getErrorMsg(error) }));
      yield put(stopSubmit(payload.formName, { _error: getErrorMsg(error) }));
    }
    yield put(actions.placeOrderFailed(getErrorMsg(error)));
  }
}

function* setVolumeFieldValue(
  formName: NS.PlaceOrderFormName,
  formType: OrderSide,
  volume?: string,
  price?: string
) {
  if (volume !== void 0) {
    const currencyPair: ICurrencyPair | null = yield select(configSelectors.selectCurrentCurrencyPair);

    if (currencyPair === null) {
      console.warn('currencyPair is not initialized in setting place order volume field');
      return;
    }

    const commonCalculateVolumeOptions: NS.ICommonCalculateVolumeOptions =
      yield select(makeCommonOptionsForCalculateVolumeSelector(currencyPair));

    const maxVolume = calculateVolume({
      ...commonCalculateVolumeOptions,
      price,
      balancePercentage: 100,
      formType,
    });
    const newVolumeFieldValue = volume
      ? floorFloatToFixed(Math.min(maxVolume, Number(volume)), currencyPair.amountScale)
      : '';
    yield put(change(formName, 'volume', newVolumeFieldValue));
  }
}

function* executeCopyOrderToModal({ payload }: NS.ICopyOrderToModal) {
  const { orderSide, price, volume } = payload;
  const formName = {
    buy: placeBuyOrderModalFormEntry.name,
    sell: placeSellOrderModalFormEntry.name,
  }[payload.orderSide];

  yield put(actions.setPlaceOrderModal({ isOpen: true }));
  yield put(actions.setSinglePlaceOrderForm({
    formKind: 'modal',
    placeOrderFormData: { orderSide },
  }));

  yield put(actions.setFormPriceUpdate({ formType: payload.orderSide, isPriceUpdateEnabled: false }));

  yield put(change(formName, 'price', price));
  yield call(setVolumeFieldValue, formName, orderSide, volume, price);
}

function* executeCopyOrderToWidget({ payload }: NS.ICopyOrderToWidget) {
  const { orderSide, ...orderSidesOrders } = payload;
  const orderSidesKeys = Object.keys(orderSidesOrders) as OrderSide[];

  yield put(actions.setSinglePlaceOrderForm({
    formKind: 'widget',
    placeOrderFormData: { orderSide },
  }));

  for (const orderSideKey of orderSidesKeys) {
    const price = payload[orderSideKey]!.price;
    const volume = payload[orderSideKey]!.volume;

    yield put(actions.setFormPriceUpdate({ formType: orderSideKey, isPriceUpdateEnabled: false }));

    switch (orderSideKey) {
      case 'buy':
        yield put(change(placeBuyOrderFormEntry.name, 'price', price));
        yield call(setVolumeFieldValue, placeBuyOrderFormEntry.name, 'buy', volume, price);
        break;
      case 'sell':
        yield put(change(placeSellOrderFormEntry.name, 'price', price));
        yield call(setVolumeFieldValue, placeSellOrderFormEntry.name, 'sell', volume, price);
        break;
      default:
        console.error('unexpected orderSide in', payload);
        break;
    }
  }
}

function* executeResetForm({ payload }: NS.IResetForm) {
  yield put(change(payload, 'volume', ''));
  yield put(actions.setVolumeSliderValue({ form: payload, value: 0 }));
}

export default getSaga;
