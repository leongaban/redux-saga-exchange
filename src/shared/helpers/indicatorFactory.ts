import { Indicator } from 'shared/types/indicator';
import { MACD, Volume, ColoredVolume, CustomMACD, SMA } from 'shared/view/components/StockChart/Indicators';

export type IndicatorType =
  | 'MACD'
  | 'CustomMACD'
  | 'Volume'
  | 'SMA'
  | 'ColoredVolume';

class IndicatorFactory {

  public static forName(indicatorName: IndicatorType, params?: any): Indicator | null {
    switch (indicatorName) {
      case 'MACD':
        return new MACD();
      case 'CustomMACD':
        return new CustomMACD();
      case 'Volume':
        return new Volume(params);
      case 'ColoredVolume':
        return new ColoredVolume(params);
      case 'SMA':
        return new SMA();
      default:
        console.warn('unexpected indicator name', indicatorName);
        return null;
    }
  }

}

export { IndicatorFactory };
