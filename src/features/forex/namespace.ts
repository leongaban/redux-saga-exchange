import { ICommunication, IAction, IPlainAction, IPlainFailAction, } from 'shared/types/redux';
import {
  IGetForexBalanceData,
  ICreateForexAccountRequest,
  ICreateForexAccountResponse,
  IWithdrawForexRequest,
  IWithdrawForexResponse
} from 'shared/types/requests/forex';

export interface IReduxState {
  communication: {
    getUseForex: ICommunication;
    setUseForex: ICommunication;
    getForexBalance: ICommunication;
    createForexAccount: ICommunication;
    depositIntoMT5: ICommunication;
    withdrawFromMT5: ICommunication;
  };
  data: {
    asset: string;
    balance: number;
    callingGetBalance: boolean,
    credit: number;
    equity: number;
    exchangeRate: number;
    floating: number;
    freeMargin: number;
    leverage: number;
    profit: number;
    mt5LoginId: number;
    message: string;
    margin: number;
    marginLevel: number;
    useForex: boolean;
    userAmountWithdrawn: number;
    userBalance: number;
  };
}

export type IGetUseForex = IPlainAction<'FOREX:GET_USE_FOREX'>;
export type IGetUseForexSuccess = IAction<'FOREX:GET_USE_FOREX_SUCCESS', boolean>;
export type IGetUseForexFail = IPlainFailAction<'FOREX:GET_USE_FOREX_FAIL'>;

export type ISetUseForex = IAction<'FOREX:SET_USE_FOREX', boolean>;
export type ISetUseForexSuccess = IAction<'FOREX:SET_USE_FOREX_SUCCESS', boolean>;
export type ISetUseForexFail = IPlainFailAction<'FOREX:SET_USE_FOREX_FAIL'>;

export type IGetForexBalance = IPlainAction<'FOREX:GET_FOREX_BALANCE'>;
export type IGetForexBalanceSuccess = IAction<'FOREX:GET_FOREX_BALANCE_SUCCESS', IGetForexBalanceData>;
export type IGetForexBalanceFail = IPlainFailAction<'FOREX:GET_FOREX_BALANCE_FAIL'>;

export type ICreateForexAccount = IAction<'FOREX:CREATE_FOREX_ACCOUNT', ICreateForexAccountRequest>;
export type ICreateForexAccountSuccess = IAction<'FOREX:CREATE_FOREX_ACCOUNT_SUCCESS', ICreateForexAccountResponse>;
export type ICreateForexAccountFail = IPlainFailAction<'FOREX:CREATE_FOREX_ACCOUNT_FAIL'>;

export type IWithdrawFromMT5 = IAction<'FOREX:WITHDRAW_FROM_MT5', IWithdrawForexRequest>;
export type IWithdrawFromMT5Success = IAction<'FOREX:WITHDRAW_FROM_MT5_SUCCESS', IWithdrawForexResponse>;
export type IWithdrawFromMT5Fail = IPlainFailAction<'FOREX:WITHDRAW_FROM_MT5_FAIL'>;

export type Action =
  IGetUseForex | IGetUseForexSuccess | IGetUseForexFail |
  ISetUseForex | ISetUseForexSuccess | ISetUseForexFail |
  IGetForexBalance | IGetForexBalanceSuccess | IGetForexBalanceFail |
  ICreateForexAccount | ICreateForexAccountFail | ICreateForexAccountSuccess |
  IWithdrawFromMT5 | IWithdrawFromMT5Success | IWithdrawFromMT5Fail;
