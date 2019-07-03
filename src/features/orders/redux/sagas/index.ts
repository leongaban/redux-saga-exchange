import { call, put, takeLatest, select, all } from 'redux-saga/effects';

import { IDependencies } from 'shared/types/app';
import getErrorMsg from 'shared/helpers/getErrorMsg';
import { actions as notificationService } from 'services/notification';
import * as openOrdersSelectors from 'services/openOrdersDataSource/redux/data/selectors';
import { IActiveOrder } from 'shared/types/models';

import * as actions from '../actions';
import * as NS from '../../namespace';

function getSaga(deps: IDependencies) {
  const cancelOrderType: NS.ICancelOrder['type'] = 'ORDERS:CANCEL_ORDER';
  const cancelAllOrdersType: NS.ICancelAllOrders['type'] = 'ORDERS:CANCEL_ALL_ORDERS';

  return function* saga() {
    yield all([
      takeLatest(cancelOrderType, executeCancelOrder, deps),
      takeLatest(cancelAllOrdersType, executeCancelAllOrders, deps),
    ]);
  };
}

function* executeCancelOrder({ api }: IDependencies, { payload }: NS.ICancelOrder) {
  try {
    yield call(api.orders.cancelOrder, payload);
    yield put(actions.cancelOrderCompleted());
    yield put(actions.setIsCancelModalOpen({isOpen: false}));
  } catch (error) {
    const message = getErrorMsg(error);
    yield put(actions.cancelOrderFailed(message));
  }
}

function* executeCancelAllOrders({ api }: IDependencies, { payload }: NS.ICancelOrder) {
  try {
    const orders: IActiveOrder[] = yield select(openOrdersSelectors.selectActiveOrders);
    for (const order of orders) {
      yield call(api.orders.cancelOrder, order.id);
    }
    yield put(actions.cancelAllOrdersCompleted());
  } catch (error) {
    yield put(notificationService.setNotification({
      kind: 'error',
      text: 'Some orders cannot be canceled',
    }));
    const message = getErrorMsg(error);
    yield put(actions.cancelAllOrdersFailed(message));
  }
}

export default getSaga;
