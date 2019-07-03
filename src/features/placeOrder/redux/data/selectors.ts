import { createSelector } from 'reselect';

import { IAppReduxState } from 'shared/types/app';
import { OrderType, ICurrencyPair, ITradeOrders, IBalanceDict, OrderSide } from 'shared/types/models';
import { ICommunication } from 'shared/types/redux';
import { selectors as userSelectors } from 'services/user';
import { selectors as orderBookDSSelectors } from 'services/orderBookDataSource';

import * as NS from '../../namespace';

export function selectFeatureState(state: IAppReduxState): NS.IReduxState {
  if (!state.placeOrder) {
    throw new Error('Cannot find orders feature state!');
  }

  return state.placeOrder;
}

export function selectPlaceOrderModal(state: IAppReduxState): NS.IPlaceOrderModal {
  return selectFeatureState(state).ui.placeOrderModal;
}

export function selectPlaceOrderLocalFormState(
  state: IAppReduxState, formName: NS.PlaceOrderFormName,
): NS.IPlaceOrderLocalFormState {
  return selectFeatureState(state).edit.placeOrderForms[formName];
}

export function selectCommunicationPlaceOrder(state: IAppReduxState): ICommunication {
  return selectFeatureState(state).communication.placeOrder;
}

export function selectFormPriceUpdate(state: IAppReduxState, formType: OrderSide): boolean {
  return formType === 'buy'
    ? selectFeatureState(state).edit.isBuyFormPriceUpdateEnabled
    : selectFeatureState(state).edit.isSellFormPriceUpdateEnabled;
}

export function selectSelectedOrderType(state: IAppReduxState): OrderType {
  return selectFeatureState(state).edit.selectedOrderType;
}

export function selectSinglePlaceOrderForm(
  state: IAppReduxState, formKind: NS.SinglePlaceOrderFormKind,
): NS.ISinglePlaceOrderForm {
  return selectFeatureState(state).ui.singlePlaceOrderForms[formKind];
}

export function makeCommonOptionsForCalculateVolumeSelector(currencyPair: ICurrencyPair) {
  return createSelector(
    selectSelectedOrderType,
    userSelectors.selectBalanceDict,
    orderBookDSSelectors.selectOrders,
    (selectedOrderType: OrderType, balanceDict: IBalanceDict, orders: ITradeOrders
    ): NS.ICommonCalculateVolumeOptions => {
      return {
        orderType: selectedOrderType,
        askOrders: orders.ask,
        baseCurrencyBalance: balanceDict[currencyPair.baseCurrency] || 0,
        counterCurrencyBalance: balanceDict[currencyPair.counterCurrency] || 0,
      };
    },
  );
}
