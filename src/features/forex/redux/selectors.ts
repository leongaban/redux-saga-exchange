import { IAppReduxState } from 'shared/types/app';
import * as NS from '../namespace';

export function selectFeatureState(state: IAppReduxState): NS.IReduxState {
  return state.forex;
}

export function selectCanUseForex(state: IAppReduxState): boolean {
  return selectFeatureState(state).data.useForex;
}

export function selectIsUseForexFetching(state: IAppReduxState): boolean {
  return selectFeatureState(state).communication.getUseForex.isRequesting;
}

export function selectIsBalanceFetching(state: IAppReduxState): boolean {
  return selectFeatureState(state).communication.getForexBalance.isRequesting;
}

export function selectIsCreatingForexAccount(state: IAppReduxState): boolean {
  return selectFeatureState(state).communication.createForexAccount.isRequesting;
}

export function selectMt5LoginId(state: IAppReduxState): number {
  return selectFeatureState(state).data.mt5LoginId;
}

export function selectBaseAsset(state: IAppReduxState): string {
  return selectFeatureState(state).data.asset;
}

export function selectForexMessage(state: IAppReduxState): string {
  return selectFeatureState(state).data.message;
}

export function selectIsWithdrawingFromMT5(state: IAppReduxState): boolean {
  return selectFeatureState(state).communication.withdrawFromMT5.isRequesting;
}

export function selectBalance(state: IAppReduxState): number {
  return selectFeatureState(state).data.balance;
}

export function selectCredit(state: IAppReduxState): number {
  return selectFeatureState(state).data.credit;
}

export function selectLeverage(state: IAppReduxState): number {
  return selectFeatureState(state).data.leverage;
}

export function selectEquity(state: IAppReduxState): number {
  return selectFeatureState(state).data.equity;
}

export function selectFloating(state: IAppReduxState): number {
  return selectFeatureState(state).data.floating;
}

export function selectFreeMagin(state: IAppReduxState): number {
  return selectFeatureState(state).data.freeMargin;
}

export function selectMargin(state: IAppReduxState): number {
  return selectFeatureState(state).data.margin;
}

export function selectMarginLevel(state: IAppReduxState): number {
  return selectFeatureState(state).data.marginLevel;
}

export function selectProfit(state: IAppReduxState): number {
  return selectFeatureState(state).data.profit;
}

export function selectExchangeRate(state: IAppReduxState): number {
  return selectFeatureState(state).data.exchangeRate;
}

export function selectCheckCallBalance(state: IAppReduxState): boolean {
  return selectFeatureState(state).data.callingGetBalance;
}

export function selectUserAmountWithdrawn(state: IAppReduxState): number {
  return selectFeatureState(state).data.userAmountWithdrawn;
}
