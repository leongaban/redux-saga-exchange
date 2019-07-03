const StockChartX = (window as any).StockChartX;

abstract class Indicator {

  public abstract getIndicator(panelHeightRatio: number): any;
  public setupIndicator(gChart: any, indicator: any, accuracy?: number): void {
    if (accuracy) {
      this.setIndicatorPanelAccuracy(indicator, accuracy);
    }
  }
  public reset(gChart: any, indicator: any): void {
    return;
  }
  public setTheme(gChart: any, indicator: any, theme: any): void {
    return;
  }
  private setIndicatorPanelAccuracy(indicator: any, accuracy: number) {
    const { _panel: panel } = indicator;
    const { formatter: panelFormatter } = panel.valueScale;
    if (panelFormatter instanceof StockChartX.IntlNumberFormat) {
      panelFormatter.setDecimalDigits(accuracy);
      panel.valueScale.calibrator.interval = Number(`0.${'0'.repeat(accuracy - 1)}1`);
    }
  }

}

export { Indicator };
