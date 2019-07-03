import { IDepthHistory, IChartItem } from 'shared/types/models';
import * as NS from '../namespace';

export function selectChartData(state: NS.IReduxState): IChartItem[] {
  return state.data.history;
}

export function selectDepthHistory(state: NS.IReduxState): IDepthHistory {
  return state.data.depthHistory;
}

export function selectCurrentCandle(state: NS.IReduxState): IChartItem {
  return state.data.currentCandle;
}

export function selectError(state: NS.IReduxState): string | undefined {
  return state.data.error;
}

export function selectIndicatorsDialogState(state: NS.IReduxState): boolean {
  return state.ui.modals.indicatorsDialog.isOpen;
}
