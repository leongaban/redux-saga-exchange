import { put, call, all, takeLatest } from 'redux-saga/effects';
import * as R from 'ramda';

import { IDependencies } from 'shared/types/app';
import getErrorMsg, { isApiError, getApiError } from 'shared/helpers/getErrorMsg';
import { actions as notificationActions } from 'services/notification';

import * as NS from '../../namespace';
import * as actions from '../actions';
import { ILPAssetsResponse, ILoanAgreementRes } from 'shared/types/models/liquidityPool';

function getSaga(deps: IDependencies) {
  const getTioLockedBalanceType: NS.IGetTioLockedBalance['type'] = 'LIQUIDITY-POOL:GET_TIO_LOCKED_BALANCE';
  const getLPAssetsType: NS.IGetLPAssets['type'] = 'LIQUIDITY-POOL:GET_LP_ASSETS';
  const setUseLiquidityPoolType: NS.ISetUseLiquidityPool['type'] = 'LIQUIDITY-POOL:SET_USE_LP';
  const getUseLiquidityPoolType: NS.IGetUseLiquidityPool['type'] = 'LIQUIDITY-POOL:GET_USE_LP';
  const getTotalTIOType: NS.IGetTotalTIO['type'] = 'LIQUIDITY-POOL:GET_TOTAL_TIO';
  const makePayoutType: NS.IMakePayout['type'] = 'LIQUIDITY-POOL:MAKE_PAYOUT';
  const postLoadngAgreement: NS.IPostLoandAgreement['type'] = 'LIQUIDITY-POOL:POST_LOAN_AGREEMENT';

  return function* saga() {
    yield all([
      takeLatest(getTioLockedBalanceType, executeGetTioLockedBalance, deps),
      takeLatest(getLPAssetsType, executeGetLPAssets, deps),
      takeLatest(setUseLiquidityPoolType, executeSetUseLiquidityPool, deps),
      takeLatest(getUseLiquidityPoolType, executeGetUseLiquidityPool, deps),
      takeLatest(getTotalTIOType, executeGetTotalTio, deps),
      takeLatest(makePayoutType, executeMakePayout, deps),
      takeLatest(postLoadngAgreement, executePostLoandAgreement, deps),
    ]);
  };
}

function* executeGetTioLockedBalance({ api }: IDependencies, { payload: userId }: NS.IGetTioLockedBalance) {
  try {
    const tioLockedBalance: number = yield call(api.liquidityPool.getTioLockedBalance, userId);
    yield put(actions.getTioLockedBalanceSuccess(tioLockedBalance));
  } catch (error) {
    const errorMsg = isApiError(error) ? getApiError(error)(R.T) : getErrorMsg(error);
    yield put(notificationActions.setNotification({ kind: 'error', text: errorMsg }));
    yield put(actions.getTioLockedBalanceFail(errorMsg));
  }
}

function* executeGetLPAssets({ api }: IDependencies, { payload: userId }: NS.IGetLPAssets) {
  try {
    const assets: ILPAssetsResponse = yield call(api.liquidityPool.getLPAssets, userId);
    yield put(actions.getLPAssetsSuccess(assets));
  } catch (error) {
    const errorMsg = isApiError(error) ? getApiError(error)(R.T) : getErrorMsg(error);
    yield put(notificationActions.setNotification({ kind: 'error', text: errorMsg }));
    yield put(actions.getLPAssetsFail(errorMsg));
  }
}

function* executeSetUseLiquidityPool({ api }: IDependencies, { payload }: NS.ISetUseLiquidityPool) {
  try {
    yield call(api.liquidityPool.setUseLiquidityPool, payload);
    yield put(actions.setUseLiquidityPoolSuccess(payload));
  } catch (error) {
    const errorMsg = isApiError(error) ? getApiError(error)(R.T) : getErrorMsg(error);
    yield put(notificationActions.setNotification({ kind: 'error', text: errorMsg }));
    yield put(actions.setUseLiquidityPoolFail(errorMsg));
  }
}

function* executeGetUseLiquidityPool({ api }: IDependencies) {
  try {
    const useLiquidityPool = yield call(api.liquidityPool.getUseLiquidityPool);
    yield put(actions.getUseLiquidityPoolSuccess(useLiquidityPool));
  } catch (error) {
    const errorMsg = isApiError(error) ? getApiError(error)(R.T) : getErrorMsg(error);
    yield put(notificationActions.setNotification({ kind: 'error', text: errorMsg }));
    yield put(actions.getUseLiquidityPoolFail(errorMsg));
  }
}

function* executeMakePayout({ api }: IDependencies, { payload }: NS.IMakePayout) {
  try {
    yield call(api.liquidityPool.makePayout, payload);
    yield put(actions.makePayoutSuccess());
    yield put(notificationActions.setNotification({ kind: 'info', text: 'Success! Your TIOx has exited the LP.' }));
  } catch (error) {
    const errorMsg = isApiError(error) ? getApiError(error)(R.T) : getErrorMsg(error);
    yield put(notificationActions.setNotification({ kind: 'error', text: errorMsg }));
    yield put(actions.makePayoutFail(errorMsg));
  }
}

function* executeGetTotalTio({ api }: IDependencies) {
  try {
    const totalTio = yield call(api.liquidityPool.getTotalTio);
    yield put(actions.getTotalTioSuccess(totalTio));
  } catch (error) {
    const errorMsg = isApiError(error) ? getApiError(error)(R.T) : getErrorMsg(error);
    yield put(notificationActions.setNotification({ kind: 'error', text: errorMsg }));
    yield put(actions.getTotalTioFail(errorMsg));
  }
}

function* executePostLoandAgreement({ api }: IDependencies, { payload }: NS.IPostLoandAgreement) {
  try {
    const pandaDocRes: ILoanAgreementRes = yield call(api.liquidityPool.postLoanAgreement, payload);
    const pandaDocUrl: string = `https://app.pandadoc.com/s/${pandaDocRes.session_id}`;
    const pandaDocId: string = pandaDocRes.document_id;
    yield put(actions.postLoanAgreementSuccess({
      pandaDocUrl,
      pandaDocId
    }));
  } catch (error) {
    yield put(actions.postLoanAgreementFail(error));
  }
}
export { getSaga };
