import { Indicator } from 'shared/types/indicator';

const TASdk = (window as any).TASdk;
const StockChartX = (window as any).StockChartX;
const CustomMACDIndicator = (window as any).CustomMACD;

class CustomMACD extends Indicator {

  public getIndicator(panelHeightRatio: number): any {
    return new CustomMACDIndicator({
      panelHeightRatio,
      marginTop: 20,
      indicatorName: 'CustomMACD',
      [StockChartX.IndicatorParam.SIGNAL_PERIODS]: 9,
      [StockChartX.IndicatorParam.LONG_CYCLE]: 26,
      [StockChartX.IndicatorParam.SHORT_CYCLE]: 12,
      [StockChartX.IndicatorParam.MA_TYPE]: TASdk.Const.simpleMovingAverage,
      barDirectionFn(i: number, dataSeries: any) {
        dataSeries = dataSeries[0].values;
        const prev = i === 0 ? 0 : dataSeries[i - 1];
        return dataSeries[i] >= prev ? StockChartX.BarDirection.Up : StockChartX.BarDirection.Down;
      },
    });
  }

}

export { CustomMACD };
