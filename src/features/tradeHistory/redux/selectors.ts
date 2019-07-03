import { IAppReduxState } from 'shared/types/app';
import { ICommunication } from 'shared/types/redux';
import { ITrade, IExtendedTrade } from 'shared/types/models';

import * as NS from '../namespace';

export function getFeatureState(state: IAppReduxState): NS.IReduxState {
  return state.tradeHistory;
}

export function selectTrades(state: IAppReduxState): ITrade[] {
  return getFeatureState(state).data.trades;
}

export function selectExtendedTrades(state: IAppReduxState): IExtendedTrade[] {
  return getFeatureState(state).data.extendedTrades;
}

export function selectExtendedTradesTotalPages(state: IAppReduxState): number {
  return getFeatureState(state).edit.extendedTradesTotalPages;
}

export function selectLoadCommunication(state: IAppReduxState): ICommunication {
  return getFeatureState(state).communication.load;
}
