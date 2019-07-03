import * as NS from '../../namespace';
import { makeCommunicationActionCreators } from 'shared/helpers/redux';

// tslint:disable:max-line-length
export const { execute: getTioLockedBalance, completed: getTioLockedBalanceSuccess, failed: getTioLockedBalanceFail } =
  makeCommunicationActionCreators<NS.IGetTioLockedBalance, NS.IGetTioLockedBalanceSuccess, NS.IGetTioLockedBalanceFail>(
    'LIQUIDITY-POOL:GET_TIO_LOCKED_BALANCE', 'LIQUIDITY-POOL:GET_TIO_LOCKED_BALANCE_SUCCESS', 'LIQUIDITY-POOL:GET_TIO_LOCKED_BALANCE_FAIL',
  );

export const { execute: getLPAssets, completed: getLPAssetsSuccess, failed: getLPAssetsFail } =
  makeCommunicationActionCreators<NS.IGetLPAssets, NS.IGetLPAssetsSuccess, NS.IGetLPAssetsFail>(
    'LIQUIDITY-POOL:GET_LP_ASSETS', 'LIQUIDITY-POOL:GET_LP_ASSETS_SUCCESS', 'LIQUIDITY-POOL:GET_LP_ASSETS_FAIL',
  );

export const { execute: setUseLiquidityPool, completed: setUseLiquidityPoolSuccess, failed: setUseLiquidityPoolFail } =
  makeCommunicationActionCreators<NS.ISetUseLiquidityPool, NS.ISetUseLiquidityPoolSuccess, NS.ISetUseLiquidityPoolFail>(
    'LIQUIDITY-POOL:SET_USE_LP', 'LIQUIDITY-POOL:SET_USE_LP_SUCCESS', 'LIQUIDITY-POOL:SET_USE_LP_FAIL',
  );

export const { execute: getUseLiquidityPool, completed: getUseLiquidityPoolSuccess, failed: getUseLiquidityPoolFail } =
  makeCommunicationActionCreators<NS.IGetUseLiquidityPool, NS.IGetUseLiquidityPoolSuccess, NS.IGetUseLiquidityPoolFail>(
    'LIQUIDITY-POOL:GET_USE_LP', 'LIQUIDITY-POOL:GET_USE_LP_SUCCESS', 'LIQUIDITY-POOL:GET_USE_LP_FAIL',
  );

export const { execute: makePayout, completed: makePayoutSuccess, failed: makePayoutFail } =
  makeCommunicationActionCreators<NS.IMakePayout, NS.IMakePayoutSuccess, NS.IMakePayoutFail>(
    'LIQUIDITY-POOL:MAKE_PAYOUT', 'LIQUIDITY-POOL:MAKE_PAYOUT_SUCCESS', 'LIQUIDITY-POOL:MAKE_PAYOUT_FAIL',
  );

export const { execute: getTotalTio, completed: getTotalTioSuccess, failed: getTotalTioFail } =
makeCommunicationActionCreators<NS.IGetTotalTIO, NS.IGetTotalTIOSuccess, NS.IGetTotalTIOFail>(
  'LIQUIDITY-POOL:GET_TOTAL_TIO', 'LIQUIDITY-POOL:GET_TOTAL_TIO_SUCCESS', 'LIQUIDITY-POOL:GET_TOTAL_TIO_FAIL',
);

export const { execute: postLoanAgreement, completed: postLoanAgreementSuccess, failed: postLoanAgreementFail } =
makeCommunicationActionCreators<NS.IPostLoandAgreement, NS.IPostLoandAgreementSuccess, NS.IPostLoandAgreementFail>(
  'LIQUIDITY-POOL:POST_LOAN_AGREEMENT', 'LIQUIDITY-POOL:POST_LOAN_AGREEMENT_SUCCESS', 'LIQUIDITY-POOL:POST_LOAN_AGREEMENT_FAIL',
);
