import { Omit } from 'react-redux';

import { IStockChartSettings } from 'shared/types/models';

export const chartStaticSettings: Omit<IStockChartSettings, 'interval' | 'periodicity'> = {
  activeChartKind: 'candlesticks',
  barStyle: 'bar',
  candlesticksChartKind: 'stockchart-x',
  tvIndicators: [],
  indicators: ['SMA', 'ColoredVolume'],
  isZoomEnabled: true,
};
