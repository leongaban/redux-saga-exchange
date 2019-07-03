import * as NS from '../../namespace';
import { IAppReduxState } from 'shared/types/app';
import { IMarket } from 'shared/types/models';

function selectFeatureState(state: IAppReduxState): NS.IReduxState {
  if (!state.markets) {
    throw new Error('Cannot find markets feature state!');
  }

  return state.markets;
}

export function selectMarkets(state: IAppReduxState): IMarket[] {
  return selectFeatureState(state).data.markets;
}

export function selectCurrentMarket(state: IAppReduxState): IMarket | null {
  return selectFeatureState(state).edit.currentMarket;
}

export function selectIsEditMarketModalShown(state: IAppReduxState): boolean {
  return selectFeatureState(state).ui.isEditMarketModalShown;
}
