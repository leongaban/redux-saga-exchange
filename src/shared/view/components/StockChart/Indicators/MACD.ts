import { Indicator } from 'shared/types/indicator';

const TASdk = (window as any).TASdk;
const StockChartX = (window as any).StockChartX;

class MACD extends Indicator {

  public getIndicator(panelHeightRatio: number): any {
    return new StockChartX.TAIndicator({ taIndicator: TASdk.MACD, panelHeightRatio, marginTop: 20 });
  }

}

export { MACD };
