import { Indicator } from 'shared/types/indicator';

const StockChartX = (window as any).StockChartX;

interface IProps {
  lineWidth?: number;
}

class ColoredVolume extends Indicator {
  private props: IProps;

  constructor(props?: IProps) {
    super();
    this.props = props || {};
  }

  public getIndicator(panelHeightRatio: number): any {
    return new StockChartX.TAIndicator({taIndicator: StockChartX.ColoredVolumeIndicator, panelHeightRatio});
  }

  public setupIndicator(gChart: any, indicator: any, accuracy: number): void {
    super.setupIndicator(gChart, indicator, accuracy);
    this.props.lineWidth && indicator.setParameterValue(StockChartX.IndicatorParam.LINE_WIDTH, this.props.lineWidth);
    indicator.coloredVolumeTheme = gChart.theme.plot.bar.candle;
  }

  public reset(gChart: any, indicator: any): void {
    indicator.coloredVolumeTheme = null;
  }

  public setTheme(gChart: any, indicator: any, theme: any): void {
    indicator.coloredVolumeTheme = StockChartX.JsUtil.clone(theme.plot.bar.candle);
  }
}

export { ColoredVolume };
