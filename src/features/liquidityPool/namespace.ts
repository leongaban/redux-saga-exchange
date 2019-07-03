import { ICommunication, IAction, IPlainFailAction, IPlainAction } from 'shared/types/redux';
import { ILPAsset, ILPAssetsResponse } from 'shared/types/models/liquidityPool';
import { IMakePayoutRequest, IPandaDocsRequest, IPandaDocsResponse } from 'shared/types/requests';

export interface IReduxState {
  communication: {
    getTioLockedBalance: ICommunication;
    getLPAssets: ICommunication;
    setUseLiquidityPool: ICommunication;
    getUseLiquidityPool: ICommunication;
    makePayout: ICommunication;
    postLoanAgreement: ICommunication;
  };
  data: {
    assets: ILPAsset[];
    lastPayoutTs: string;
    poolTotalTio: number;
    pandaDocId: string;
    pandaDocUrl?: string;
    sessionId?: string;
    timeValid: boolean;
    tioLocked: number;
    totalTio: number;
    useLiquidityPool: boolean;
  };
  edit: {
    assetFilter: string;
    conversionCurrency: string;
  };
}

export type IGetTioLockedBalance = IAction<'LIQUIDITY-POOL:GET_TIO_LOCKED_BALANCE', string>;
export type IGetTioLockedBalanceSuccess = IAction<'LIQUIDITY-POOL:GET_TIO_LOCKED_BALANCE_SUCCESS', number>;
export type IGetTioLockedBalanceFail = IPlainFailAction<'LIQUIDITY-POOL:GET_TIO_LOCKED_BALANCE_FAIL'>;

export type IGetLPAssets = IAction<'LIQUIDITY-POOL:GET_LP_ASSETS', string>;
export type IGetLPAssetsSuccess = IAction<'LIQUIDITY-POOL:GET_LP_ASSETS_SUCCESS', ILPAssetsResponse>;
export type IGetLPAssetsFail = IPlainFailAction<'LIQUIDITY-POOL:GET_LP_ASSETS_FAIL'>;

export type ISetUseLiquidityPool = IAction<'LIQUIDITY-POOL:SET_USE_LP', boolean>;
export type ISetUseLiquidityPoolSuccess = IAction<'LIQUIDITY-POOL:SET_USE_LP_SUCCESS', boolean>;
export type ISetUseLiquidityPoolFail = IPlainFailAction<'LIQUIDITY-POOL:SET_USE_LP_FAIL'>;

export type IGetUseLiquidityPool = IPlainAction<'LIQUIDITY-POOL:GET_USE_LP'>;
export type IGetUseLiquidityPoolSuccess = IAction<'LIQUIDITY-POOL:GET_USE_LP_SUCCESS', boolean>;
export type IGetUseLiquidityPoolFail = IPlainFailAction<'LIQUIDITY-POOL:GET_USE_LP_FAIL'>;

export type ISetAssetFilter = IAction<'LIQUIDITY-POOL:SET_ASSET_FILTER', string>;

export type IMakePayout = IAction<'LIQUIDITY-POOL:MAKE_PAYOUT', IMakePayoutRequest>;
export type IMakePayoutSuccess = IPlainAction<'LIQUIDITY-POOL:MAKE_PAYOUT_SUCCESS'>;
export type IMakePayoutFail = IPlainFailAction<'LIQUIDITY-POOL:MAKE_PAYOUT_FAIL'>;

export type IGetTotalTIO = IPlainAction<'LIQUIDITY-POOL:GET_TOTAL_TIO'>;
export type IGetTotalTIOSuccess = IAction<'LIQUIDITY-POOL:GET_TOTAL_TIO_SUCCESS', number>;
export type IGetTotalTIOFail = IPlainFailAction<'LIQUIDITY-POOL:GET_TOTAL_TIO_FAIL'>;

export type IPostLoandAgreement = IAction<'LIQUIDITY-POOL:POST_LOAN_AGREEMENT', IPandaDocsRequest>;
export type IPostLoandAgreementSuccess = IAction<'LIQUIDITY-POOL:POST_LOAN_AGREEMENT_SUCCESS', IPandaDocsResponse>;
export type IPostLoandAgreementFail = IPlainFailAction<'LIQUIDITY-POOL:POST_LOAN_AGREEMENT_FAIL'>;

export type ISetConversionCurrency = IAction<'LIQUIDITY-POOL:SET_CONVERSION_CURRENCY', string>;

export type IRemoveLoandAgreement = IPlainAction<'LIQUIDITY-POOL:REMOVE_LOAN_AGREEMENT'>;

export type Action = ISetConversionCurrency |
    IGetTioLockedBalance | IGetTioLockedBalanceSuccess | IGetTioLockedBalanceFail |
    ISetUseLiquidityPool | ISetUseLiquidityPoolSuccess | ISetUseLiquidityPoolFail |
    IGetUseLiquidityPool | IGetUseLiquidityPoolSuccess | IGetUseLiquidityPoolFail |
    IMakePayout | IMakePayoutSuccess | IMakePayoutFail |
    IGetLPAssets | IGetLPAssetsSuccess | IGetLPAssetsFail |
    IGetTotalTIO | IGetTotalTIOSuccess | IGetTotalTIOFail | ISetAssetFilter |
    IPostLoandAgreement | IPostLoandAgreementSuccess | IPostLoandAgreementFail |
    IRemoveLoandAgreement;
