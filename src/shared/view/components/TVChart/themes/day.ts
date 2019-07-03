import { colors } from 'shared/view/styles/themes/day/variables';

export default {
  'paneProperties.background': colors.chartBackgroundColor,
  'paneProperties.vertGridProperties.color': colors.chartGridColor,
  'paneProperties.horzGridProperties.color': colors.chartGridColor,

  'mainSeriesProperties.candleStyle.upColor': colors.upCandleColor,
  'mainSeriesProperties.candleStyle.downColor': colors.downCandleColor,
  'mainSeriesProperties.candleStyle.wickUpColor': colors.upCandleColor,
  'mainSeriesProperties.candleStyle.wickDownColor': colors.downCandleColor,

  'scalesProperties.backgroundColor': colors.upCandleColor,
  'scalesProperties.lineColor': colors.chartGridColor,
  'scalesProperties.textColor': colors.yAxisTextColor,
};
