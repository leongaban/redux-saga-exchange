import {Indicator} from 'shared/types/indicator';

const StockChartX = (window as any).StockChartX;

interface IProps {
  lineWidth?: number;
}

class Volume extends Indicator {
  private props: IProps;

  constructor(props?: IProps) {
    super();
    this.props = props || {};
  }

  public getIndicator(panelHeightRatio: number): any {
    return new StockChartX.TAIndicator({taIndicator: StockChartX.VolumeIndicator, panelHeightRatio});
  }

  public setupIndicator(gChart: any, indicator: any): void {
    this.props.lineWidth && indicator.setParameterValue(StockChartX.IndicatorParam.LINE_WIDTH, this.props.lineWidth);
  }
}

export { Volume };
