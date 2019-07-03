import { Indicator } from 'shared/types/indicator';

const StockChartX = (window as any).StockChartX;
const CustomSMAIndicator = (window as any).CustomSMA;
const TASdk = (window as any).TASdk;

class SMA extends Indicator {

  public getIndicator(panelHeightRatio: number) {
    return new CustomSMAIndicator({
      panelHeightRatio,
      taIndicator: TASdk.SimpleMovingAverage,
      parameters: {
        [StockChartX.IndicatorParam.PERIODS]: [7, 25, 40],
        [StockChartX.IndicatorParam.SOURCE]: StockChartX.DataSeriesSuffix.CLOSE,
      }
    });
  }
}

export { SMA };
