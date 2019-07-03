import { combineReducers } from 'redux';
import { makeCommunicationReducer } from 'shared/helpers/redux';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';

import { initial } from '../initial';

// tslint:disable:max-line-length
export const communicationReducer = combineReducers<NS.IReduxState['communication']>({
  getTioLockedBalance: makeCommunicationReducer<NS.IGetTioLockedBalance, NS.IGetTioLockedBalanceSuccess, NS.IGetTioLockedBalanceFail>(
    'LIQUIDITY-POOL:GET_TIO_LOCKED_BALANCE',
    'LIQUIDITY-POOL:GET_TIO_LOCKED_BALANCE_SUCCESS',
    'LIQUIDITY-POOL:GET_TIO_LOCKED_BALANCE_FAIL',
    initial.communication.getTioLockedBalance,
  ),
  getLPAssets: makeCommunicationReducer<NS.IGetLPAssets, NS.IGetLPAssetsSuccess, NS.IGetLPAssetsFail>(
    'LIQUIDITY-POOL:GET_LP_ASSETS',
    'LIQUIDITY-POOL:GET_LP_ASSETS_SUCCESS',
    'LIQUIDITY-POOL:GET_LP_ASSETS_FAIL',
    initial.communication.getLPAssets,
  ),
  setUseLiquidityPool: makeCommunicationReducer<NS.ISetUseLiquidityPool, NS.ISetUseLiquidityPoolSuccess, NS.ISetUseLiquidityPoolFail>(
    'LIQUIDITY-POOL:SET_USE_LP',
    'LIQUIDITY-POOL:SET_USE_LP_SUCCESS',
    'LIQUIDITY-POOL:SET_USE_LP_FAIL',
    initial.communication.setUseLiquidityPool,
  ),
  getUseLiquidityPool: makeCommunicationReducer<NS.IGetUseLiquidityPool, NS.IGetUseLiquidityPoolSuccess, NS.IGetUseLiquidityPoolFail>(
    'LIQUIDITY-POOL:GET_USE_LP',
    'LIQUIDITY-POOL:GET_USE_LP_SUCCESS',
    'LIQUIDITY-POOL:GET_USE_LP_FAIL',
    initial.communication.getUseLiquidityPool,
  ),
  makePayout: makeCommunicationReducer<NS.IMakePayout, NS.IMakePayoutSuccess, NS.IMakePayoutFail>(
    'LIQUIDITY-POOL:MAKE_PAYOUT',
    'LIQUIDITY-POOL:MAKE_PAYOUT_SUCCESS',
    'LIQUIDITY-POOL:MAKE_PAYOUT_FAIL',
    initial.communication.makePayout,
  ),
  postLoanAgreement: makeCommunicationReducer<NS.IPostLoandAgreement, NS.IPostLoandAgreementSuccess, NS.IPostLoandAgreementFail>(
    'LIQUIDITY-POOL:POST_LOAN_AGREEMENT',
    'LIQUIDITY-POOL:POST_LOAN_AGREEMENT_SUCCESS',
    'LIQUIDITY-POOL:POST_LOAN_AGREEMENT_FAIL',
    initial.communication.postLoanAgreement,
  ),
} as ReducersMap<NS.IReduxState['communication']>);
