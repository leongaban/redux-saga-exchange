import block from 'bem-cn';
import { bind } from 'decko';
import * as React from 'react';
import * as R from 'ramda';

import { ROUTES_PREFIX } from 'core/constants';
import { stockChartDefaultHistoryDepth } from 'shared/constants';
import { IChartItem } from 'shared/types/models';
import { Indicator } from 'shared/types/indicator';
import { UITheme } from 'shared/types/ui';
import { IndicatorFactory, IndicatorType } from 'shared/helpers/indicatorFactory';
import { DayTheme, NightTheme, MoonTheme } from './Themes';
import { envLogger } from 'shared/helpers/debug';
import { formatDecimalIfLarge, floorFloatToFixed } from 'shared/helpers/number';

import PanelBlock from './Classes/PanelBlock';
import './StockChart.scss';

interface IState {
  mIsChartFrozenByLongTouch: boolean;
  mHoveredRecordIndex: number | null;
}

interface IProps {
  theme: UITheme;
  indicators: IndicatorType[];
  periodicity: string;
  amountAccuracy: number;
  priceAccuracy: number;
  zoomEnabled: boolean;
  isFullscreenModeEnabled?: boolean;
  currentCandle?: IChartItem;
  historyDepth?: number;
  nextAction?: string;
  symbol?: string;
  plotStyle?: string;
  barsColor?: string;
  company?: string;
  exchange?: string;
  useMobileVersion?: boolean;
  onHistoryRequest(): void;
  onIndicatorRemovedByUser(indicatorName: string): void;
  onMainPanelTextUpdate?(values: { [key: string]: string }): void;
  onMainPanelCssUpdate?(values: { [key: string]: any }): void;
  mOnFreezeByLongTouchToggle?(): void;
}

interface ICandleArrayBuffer {
  date: Date[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
}

const separateIndicators: Record<IndicatorType, boolean> = {
  Volume: true,
  ColoredVolume: true,
  CustomMACD: true,
  MACD: true,
  SMA: false,
};

const b = block('stock-chart');
const StockChartX = (window as any).StockChartX;
const candlesLogger = envLogger(__filename, 'candles');

class StockChart extends React.PureComponent<IProps, IState> {
  public state: IState = {
    mIsChartFrozenByLongTouch: false,
    mHoveredRecordIndex: null,
  };

  private gChart: any;
  private currentTheme: any;
  private placeBlock: HTMLDivElement | null;
  private currentIndicators: { [key: string]: Indicator } = {};
  private barsColor: string | undefined;
  private chartWidth: number;

  private mLongTouchTimer: NodeJS.Timer | null = null;
  private mSavedPanelsGestures: any[] | null = null;
  private mFormatChartValue = R.compose(formatDecimalIfLarge, floorFloatToFixed);

  public componentDidMount() {
    const { indicators, priceAccuracy, useMobileVersion } = this.props;
    StockChartX.ViewsPath = ROUTES_PREFIX + '/view/';
    this.createChart();
    this.addIndicators(indicators);
    this.setMainPanelAccuracy(priceAccuracy);
    window.addEventListener('resize', this.handleWindowResize);

    if (this.placeBlock && useMobileVersion) {
      this.placeBlock.addEventListener('touchstart', this.mHandlePlaceBlockTouchStart);
      this.placeBlock.addEventListener('touchend', this.mHandlePlaceBlockTouchEnd, true);
      this.placeBlock.addEventListener('touchcancel', this.mHandlePlaceBlockTouchCancel, true);
      this.placeBlock.addEventListener('touchmove', this.mHandlePlaceBlockTouchMove, true);
    }
  }

  public componentWillUnmount() {
    const { useMobileVersion } = this.props;
    window.removeEventListener('resize', this.handleWindowResize);
    if (this.placeBlock && useMobileVersion) {
      this.placeBlock.removeEventListener('touchstart', this.mHandlePlaceBlockTouchStart);
      this.placeBlock.removeEventListener('touchend', this.mHandlePlaceBlockTouchEnd, true);
      this.placeBlock.removeEventListener('touchcancel', this.mHandlePlaceBlockTouchCancel, true);
      this.placeBlock.removeEventListener('touchmove', this.mHandlePlaceBlockTouchMove, true);
    }
  }

  public componentWillReceiveProps(nextProps: IProps) {
    const {
      periodicity, plotStyle, barsColor, amountAccuracy, zoomEnabled,
      currentCandle, priceAccuracy,
    } = this.props;

    const {
      currentCandle: nextCurrentCandle, periodicity: nextPeriodicity,
      amountAccuracy: nextAmountAccuracy, priceAccuracy: nextPriceAccuracy,
    } = nextProps;

    if (amountAccuracy !== nextAmountAccuracy) {
      const isVolumePanelOpen = Object.keys(this.currentIndicators).includes('ColoredVolume');
      if (isVolumePanelOpen) {
        this.setVolumePanelAccuracy(nextAmountAccuracy);
      }
    }

    if (priceAccuracy !== nextPriceAccuracy) {
      this.setMainPanelAccuracy(nextPriceAccuracy);
      const isMacdPanelOpen = Object.keys(this.currentIndicators).includes('CustomMACD');
      if (isMacdPanelOpen) {
        this.setMacdPanelAccuracy(nextPriceAccuracy);
      }
    }

    if (periodicity !== nextPeriodicity) {
      this.setTimeInterval(nextPeriodicity);
    }

    if (nextCurrentCandle) {
      if (currentCandle && currentCandle.ts === nextCurrentCandle.ts) {
        if (currentCandle !== nextCurrentCandle) {
          this.updateLastCandle(nextCurrentCandle);
        }
      } else {
        const dataSeries = this.gChart.barDataSeries();
        const lastLoadedCandleDate = +dataSeries.date.values.slice(-1)[0];
        const nextCurrentCandleDate = nextCurrentCandle.ts;

        // nextCurrentCandle.ts > 0 because of state reset after interval or market changing
        if ((lastLoadedCandleDate !== nextCurrentCandleDate) && nextCurrentCandle.ts > 0) {
          this.addLastCandle(nextCurrentCandle);
        }
      }
    }

    if (zoomEnabled !== nextProps.zoomEnabled) {
      this.setZoomEnabled(nextProps.zoomEnabled);
    }

    if (plotStyle) {
      this.gChart.priceStyle.plot.plotStyle = plotStyle;
    }
    if (this.barsColor !== barsColor) {
      this.currentTheme.valueScale.text.fillColor = barsColor;
      this.currentTheme.dateScale.text.fillColor = barsColor;
      this.barsColor = barsColor;
    }

    if (this.props.theme !== nextProps.theme) {
      this.setTheme(nextProps.theme);
      this.gChart.theme = this.currentTheme;
    }

    this.setNeedUpdate();
  }

  public componentDidUpdate(prevProps: IProps) {
    const { indicators, isFullscreenModeEnabled, currentCandle } = this.props;
    const {
      indicators: prevIndicators, isFullscreenModeEnabled: prevIsFullscreenModeEnabled,
      currentCandle: prevCurrentCandle,
    } = prevProps;

    if (!R.equals(indicators, prevIndicators)) {
      this.removeIndicators(prevIndicators);
      this.addIndicators(indicators);
      this.setNeedUpdate();
    }

    if (prevIsFullscreenModeEnabled !== isFullscreenModeEnabled) {
      this.gChart.update();
    }

    if (prevCurrentCandle && currentCandle) {
      if (
        prevCurrentCandle.low > currentCandle.low
        || prevCurrentCandle.high < currentCandle.high
      ) {
        this.gChart.setNeedsAutoScale();
        this.gChart.update();
      }
    }
  }

  public render() {
    const { useMobileVersion } = this.props;
    const { mIsChartFrozenByLongTouch, mHoveredRecordIndex } = this.state;
    const shouldRenderMobileChartValues = useMobileVersion && mIsChartFrozenByLongTouch && mHoveredRecordIndex !== null;
    return (
      <div className={b()} ref={this.setPlaceBlockRef}>
        {shouldRenderMobileChartValues && this.mRenderChartValues()}
      </div>
    );
  }

  public clear() {
    this.gChart.clearDataSeries();
    this.gChart.showWaitingBar();
  }

  public initDataSeries(data: IChartItem[]) {
    this.gChart.clearDataSeries();
    this.gChart.hideWaitingBar(true);

    const dataSeries = this.gChart.barDataSeries();
    data.map((item: IChartItem) => {
      dataSeries.date.add(new Date(item.ts));
      dataSeries.open.add(item.open);
      dataSeries.high.add(item.high);
      dataSeries.low.add(item.low);
      dataSeries.close.add(item.close);
      dataSeries.volume.add(item.volume);
    });
    this.calibrateFirstHistoryPart(data);

    if (this.props.useMobileVersion) {
      this.mSetMaxZoomIn();
    }
  }

  public addHistory(data: IChartItem[]) {
    const dataSeries = this.gChart.barDataSeries();
    const arrays: ICandleArrayBuffer = {
      date: [],
      open: [],
      high: [],
      low: [],
      close: [],
      volume: [],
    };
    data.forEach(item => {
      this.logCandle('add history', item);
      arrays.date.push(new Date(item.ts));
      arrays.open.push(item.open);
      arrays.high.push(item.high);
      arrays.low.push(item.low);
      arrays.close.push(item.close);
      arrays.volume.push(item.volume);
    });
    dataSeries.date.unshift(arrays.date);
    dataSeries.open.unshift(arrays.open);
    dataSeries.high.unshift(arrays.high);
    dataSeries.low.unshift(arrays.low);
    dataSeries.close.unshift(arrays.close);
    dataSeries.volume.unshift(arrays.volume);
    this.gChart.updateComputedDataSeries();
    this.gChart.updateIndicators();
    this.gChart.firstVisibleRecord += data.length;
    this.gChart.lastVisibleRecord += data.length;
    this.gChart.setNeedsUpdate(true);
  }

  private mRenderChartValues() {
    return (
      <>
        {this.mRenderVolumeValue()}
        {this.mRenderSMAValue()}
        {this.mRenderRightValueScaleValues()}
      </>
    );
  }

  private mRenderVolumeValue() {
    const { mHoveredRecordIndex } = this.state;
    if (mHoveredRecordIndex && this.gChart) {
      const { amountAccuracy } = this.props;
      const records = this.gChart.barDataSeries();
      const hoveredVolume = records.volume.values[mHoveredRecordIndex];
      const volumePanel = this.gChart.chartPanels.find((panel: any) => {
        return panel.indicators.find((indicator: any) => indicator.fieldNames.includes('Volume'));
      });
      if (volumePanel) {
        const { top } = volumePanel.frame;
        return hoveredVolume !== void 0 && (
          <div
            className={b('m-chart-value', { position: 'left' })()}
            style={{ top }}
          >
            {`VOL: ${this.mFormatChartValue(hoveredVolume, amountAccuracy)}`}
          </div>
        );
      } else {
        console.warn('volume panel is not found');
      }
    }
  }

  private mRenderSMAValue() {
    const { mHoveredRecordIndex } = this.state;
    if (mHoveredRecordIndex && this.gChart) {
      const { priceAccuracy } = this.props;
      const SMAPanel = this.gChart.chartPanels.find((panel: any) => {
        return panel.indicators.find((indicator: any) => indicator.__proto__.constructor.name === 'CustomSMA');
      });
      if (SMAPanel) {
        const { top } = SMAPanel.frame;
        const customSMAIndicator = this.currentIndicators.SMA as any;
        return (
          <div
            className={b('m-chart-value', { position: 'left' })()}
            style={{ top }}
          >
            {customSMAIndicator.parameters.Periods.map((period: number, i: number) => {
              const currentPlot = customSMAIndicator.plots[i];
              const plotColor: string = currentPlot.actualTheme.strokeColor;
              const SMAIndicatorValue: number = currentPlot.dataSeries[0].values[mHoveredRecordIndex];
              return SMAIndicatorValue && (
                <div
                  className={b('m-sma-value')()}
                  key={i}
                >
                  <span className={b('m-sma-title')()} style={{ color: plotColor }}>
                    {`SMA(${period}): `}
                  </span>
                  {this.mFormatChartValue(SMAIndicatorValue, priceAccuracy)}
                </div>
              );
            })}
          </div>
        );
      } else {
        console.warn('SMA panel is not found');
      }
    }
  }

  private mRenderRightValueScaleValues() {
    if (this.gChart) {
      const { height: volumeContainerHeight } = this.gChart.chartPanels[1].frame;
      const { top: mainContainerTop } = this.gChart.chartPanels[0].frame;
      const mainPanelValues = this.gChart.mainPanel.valueScale.calibrator.majorTicks;
      const mainPanelMaxValue = mainPanelValues[0].text;
      const mainPanelMinValue = mainPanelValues[mainPanelValues.length - 1].text;
      return (
        <>
          <div
            className={b('m-chart-value', { position: 'right' })()}
            style={{ top: mainContainerTop }}
          >
            {mainPanelMaxValue}
          </div>
          <div
            className={b('m-chart-value', { position: 'right' })()}
            style={{ bottom: volumeContainerHeight + 23 }}
          >
            {mainPanelMinValue}
          </div>
        </>
      );
    }
  }

  private mSetMaxZoomIn() {
    // zooms in chart to the max possible degree
    // originally neded for the mobile chart since without initial zoom it doesn't look great
    const { dateScale } = this.gChart;
    const { lastVisibleRecord, minVisibleRecords } = dateScale;
    dateScale.firstVisibleRecord = Math.max(lastVisibleRecord - minVisibleRecords, 0);
  }

  private setPlaceBlockRef = (ref: HTMLDivElement | null) => {
    this.placeBlock = ref;
    if (ref) {
      this.chartWidth = ref.offsetWidth;
    }
  }

  private setPanelAccuracy(panel: any, accuracy: number) {
    if (panel.formatter instanceof StockChartX.IntlNumberFormat) {
      panel.formatter.setDecimalDigits(accuracy);
      panel.valueScale.calibrator.interval = accuracy > 0
        ? Number(`0.${'0'.repeat(accuracy - 1)}1`)
        : 1;
    }
  }

  private setMainPanelAccuracy(accuracy: number) {
    this.setPanelAccuracy(this.gChart.mainPanel, accuracy);
  }

  private setVolumePanelAccuracy(accuracy: number) {
    const volumePanel = this.gChart.chartPanels.find((chartPanel: any) => (
      chartPanel.indicators
        .some((indicator: any) => indicator.taIndicator === StockChartX.ColoredVolumeIndicator)
    ));
    this.setPanelAccuracy(volumePanel, accuracy);
  }

  private setMacdPanelAccuracy(accuracy: number) {
    const macdPanel = this.gChart.chartPanels.find((chartPanel: any) => (
      chartPanel.indicators
        .some((indicator: any) => indicator.config && indicator.config.indicatorName === 'CustomMACD')
    ));
    this.setPanelAccuracy(macdPanel, accuracy);
  }

  private createChart(cb?: any) {
    StockChartX.Localization.localesPath = '/locales';
    const theme = this.getTheme(this.props.theme);
    this.currentTheme = {
      ...theme,
      valueScale: {
        ...theme.valueScale,
        text: {
          ...theme.valueScale.text,
        },
      },
      dateScale: {
        ...theme.dateScale,
        text: {
          ...theme.dateScale.text,
        },
      },
    };

    const handleMainPanelCssUpdate: any = this.props.onMainPanelCssUpdate || (() => null);
    const handleMainPanelTextUpdate: any = this.props.onMainPanelTextUpdate || (() => null);

    const gChartParams: { [key: string]: any } = {
      width: '100%',
      height: '100%',
      theme: this.currentTheme,
      plotStyle: this.props.plotStyle,
      showToolbar: false,
      showScrollbar: false,
      fullWindowMode: false,
      autoSave: false,
      numberOfRemainingRecordsBeforeHistoryRequest: 40,
    };

    if (this.props.onMainPanelTextUpdate != null && this.props.onMainPanelCssUpdate != null) {
      let textCache: any = {};
      let cssCache: any = {
        rootDiv: {},
        symbol: {},
        date: {},
        open: {},
        high: {},
        low: {},
        close: {},
      };
      const flushCss = () => {
        handleMainPanelCssUpdate(cssCache);
        cssCache = {
          rootDiv: {},
          symbol: {},
          date: {},
          open: {},
          high: {},
          low: {},
          close: {},
        };

      };
      const flushText = () => {
        handleMainPanelTextUpdate(textCache);
        textCache = {};
      };

      gChartParams.mappings = {
        mainPanel: {
          title(scxTitle: any) {
            return {
              rootDiv: new PanelBlock((name: string, value: string) => cssCache.rootDiv[name] = value,
                (value: string) => textCache.rootDiv = value),
              symbol: new PanelBlock((name: string, value: string) => cssCache.symbol[name] = value,
                (value: string) => textCache.symbol = value),
              date: new PanelBlock((name: string, value: string) => cssCache.date[name] = value,
                (value: string) => textCache.date = value),
              open: new PanelBlock((name: string, value: string) => cssCache.open[name] = value,
                (value: string) => textCache.open = value),
              high: new PanelBlock((name: string, value: string) => cssCache.high[name] = value,
                (value: string) => textCache.high = value),
              low: new PanelBlock((name: string, value: string) => cssCache.low[name] = value,
                (value: string) => textCache.low = value),
              close: new PanelBlock((name: string, value: string) => {
                cssCache.close[name] = value;
                flushCss();
              }, (value: string) => {
                textCache.close = value;
                flushText();
              }),
              series: this.chart.barDataSeries(),
            };
          },
        },
      };
    }
    if (this.placeBlock) {
      this.gChart = ($(this.placeBlock) as any).StockChartX(gChartParams);
      this.gChart.crossHairType = StockChartX.CrossHairType.CROSS_BARS;
      if (this.props.useMobileVersion) {
        this.gChart.valueScale.rightPanelVisible = false;
        this.gChart.crossHair._view._controls.lines.$horLine.hide();
      }
      this.setZoomEnabled(this.props.zoomEnabled);
      this.setupChart(cb);
    }
  }

  private setupChart(cb?: any) {
    this.gChart.stateHandler
      .load()
      .then((isLoaded: boolean) => {
        if (!isLoaded) {
          this.gChart.dateScale.minVisibleRecords = 45;
          this.gChart.dateScale.maxVisibleRecords = 240;
        }
        this.setupEventHandlers();
        this.loadBars();
        cb && cb();
      })
      .catch((error: any) => {
        console.error(error);
        StockChartX.UI.Notification.error(error.message);
        this.gChart.stateHandler.clear().then(() => {
          this.gChart.destroy(false);
          this.createChart(cb);
        });
      });
  }

  private setupEventHandlers() {
    if (this.gChart.keyboardHandler && this.gChart.keyboardHandler._unsubscribe) {
      // Unsubscribe all keyboard events
      this.gChart.keyboardHandler._unsubscribe();
    }
    this.gChart.on(StockChartX.ChartEvent.SYMBOL_ENTERED, () => {
      return null;
    });
    this.gChart.on(StockChartX.ChartEvent.TIME_FRAME_CHANGED, () => {
      return null;
    });
    this.gChart.on(StockChartX.ChartEvent.MORE_HISTORY_REQUESTED, () => {
      this.props.onHistoryRequest();
    });
    this.gChart.on(StockChartX.ChartEvent.INDICATOR_REMOVED_BY_USER, (event: any) => {
      const indicatorName = event.value.getName();
      Object.keys(this.currentIndicators).map(name => {
        const indicator: any = this.currentIndicators[name];
        if (indicator.getName() === indicatorName) {
          this.props.onIndicatorRemovedByUser(name);
          return;
        }
      });
    });
    if (this.props.useMobileVersion) {
      this.gChart.on(StockChartX.ChartEvent.HOVER_RECORD_CHANGED, () => {
        this.setState({ mHoveredRecordIndex: this.gChart.hoveredRecord });
      });
    }
  }

  private loadBars() {
    this.gChart.showWaitingBar();

    this.gChart.instrument = {
      symbol: this.props.symbol,
      company: this.props.company,
      exchange: this.props.exchange,
    };
    this.setTimeInterval(this.props.periodicity);
    this.gChart.updateIndicators();
  }

  private setTimeInterval(period: string) {
    this.gChart.timeInterval = (() => {
      switch (period) {
        case 's': return StockChartX.TimeSpan.MILLISECONDS_IN_SECOND;
        case 'm': return StockChartX.TimeSpan.MILLISECONDS_IN_MINUTE;
        case 'h': return StockChartX.TimeSpan.MILLISECONDS_IN_HOUR;
        case 'd': return StockChartX.TimeSpan.MILLISECONDS_IN_DAY;
        case 'w': return StockChartX.TimeSpan.MILLISECONDS_IN_WEEK;
        case 'M': return StockChartX.TimeSpan.MILLISECONDS_IN_MONTH;
        case 'y': return StockChartX.TimeSpan.MILLISECONDS_IN_YEAR;
      }
    })();
  }

  private setZoomEnabled(enabled: boolean) {
    if (enabled) {
      this.gChart.rootDiv.on('mousewheel', this.gChart, this.gChart._handleMouseEvents);
    } else {
      this.gChart.rootDiv.off('mousewheel', this.gChart._handleMouseEvents);
    }
  }

  private calibrateFirstHistoryPart(chartData: IChartItem[]) {
    const historyDepth = this.props.historyDepth || stockChartDefaultHistoryDepth;
    if (chartData.length > historyDepth) {
      this.gChart.recordRange(chartData.length - historyDepth, chartData.length);
    } else {
      // setNeedsAutoScale всего навсего добавляет два NaN'а в minVisible и maxVisible values.
      // Для памяти оставляю тут пример ручного выполнения setNeedsAutoScale:
      // this.gChart.chartPanels[0]._valueScales[0].minVisibleValue = NaN;
      // this.gChart.chartPanels[0]._valueScales[0].maxVisibleValue = NaN;
      this.gChart.recordRange(0, chartData.length);
    }
    this.gChart.setNeedsAutoScale();
    this.gChart.hideWaitingBar(true);
    this.setNeedUpdate();
  }

  private addLastCandle(candle: IChartItem) {
    const dataSeries = this.gChart.barDataSeries();
    this.logCandle('add', candle);
    dataSeries.date.add(new Date(candle.ts));
    dataSeries.open.add(candle.open);
    dataSeries.high.add(candle.high);
    dataSeries.low.add(candle.low);
    dataSeries.close.add(candle.close);
    dataSeries.volume.add(candle.volume);
    this.gChart.scrollOnRecords(-1);
  }

  private updateLastCandle(candle: IChartItem) {
    const dataSeries = this.gChart.barDataSeries();
    this.logCandle('update', candle);
    dataSeries.open.updateLast(candle.open);
    dataSeries.high.updateLast(candle.high);
    dataSeries.low.updateLast(candle.low);
    dataSeries.close.updateLast(candle.close);
    dataSeries.volume.updateLast(candle.volume);
  }

  private setNeedUpdate() {
    this.gChart.updateIndicators(); // while first rendering sma was not updated.
    this.gChart.setNeedsUpdate();
  }

  private updateIndicatorsTheme(theme: any): void {
    this.eachIndicator((instance: Indicator, ind: any) => {
      instance.setTheme(this.gChart, ind, theme);
    });
  }

  private eachIndicator(cb: any): void {
    const { indicators } = this.props;
    indicators.forEach((indicatorName: IndicatorType) => {
      const ind: any = this.currentIndicators[indicatorName];
      const instance = IndicatorFactory.forName(indicatorName);
      if (instance && ind != null && ind !== true) {
        cb(instance, ind);
      }
    });
  }

  private addIndicators(indicatorsNames: IndicatorType[]) {
    const { amountAccuracy, priceAccuracy, useMobileVersion } = this.props;
    if (indicatorsNames.length > 0) {
      const indicatorPanelHeightRatio = this.getIndicatorPanelHeightRatio(indicatorsNames);
      indicatorsNames.forEach(x => {
        const instance = IndicatorFactory.forName(x);
        if (instance) {
          const indicator = this.gChart.addIndicators(instance.getIndicator(indicatorPanelHeightRatio));
          const accuracy = (() => {
            switch (x) {
              case 'ColoredVolume':
                return amountAccuracy;
              case 'CustomMACD':
                return priceAccuracy;
              default:
                return;
            }
          })();
          instance.setupIndicator(this.gChart, indicator, accuracy);
          this.currentIndicators = { ...this.currentIndicators, [x]: indicator };
        }
      });
      if (useMobileVersion) {
        this.gChart.chartPanels.forEach((panel: any) => { panel.titleDiv[0].style.display = 'none'; });
      }
    }
  }

  private removeIndicators(indicatorNames: IndicatorType[]) {
    indicatorNames.forEach(x => {
      this.gChart.removeIndicators(this.currentIndicators[x]);
      const { [x]: _, ...newIndicators } = this.currentIndicators;
      this.currentIndicators = newIndicators;
    });
  }

  private getIndicatorPanelHeightRatio(indicatorsNames: IndicatorType[]) {
    const separateIndicatorsNumber = indicatorsNames.reduce((acc, x) => acc + (separateIndicators[x] ? 1 : 0), 0);
    const indicatorsHeightRatio = (() => {
      switch (separateIndicatorsNumber) {
        case 1:
          return 0.33;
        case 2:
          return 0.4;
        case 3:
        case 4:
          return 0.5;
        default:
          return 0.6;
      }
    })();
    return indicatorsHeightRatio / separateIndicatorsNumber;
  }

  private getTheme(themeName: UITheme) {
    switch (themeName) {
      case 'night': return NightTheme;
      case 'moon': return MoonTheme;
      default: return DayTheme;
    }
  }

  private setTheme(themeName: UITheme) {
    // const { barsColor } = this.props; // TODO extract barsColor into expanded themes
    const theme = this.getTheme(themeName);
    this.currentTheme = {
      ...theme,
      valueScale: {
        ...theme.valueScale,
        text: {
          ...theme.valueScale.text,
          // fillColor: barsColor,
        },
      },
      dateScale: {
        ...theme.dateScale,
        text: {
          ...theme.dateScale.text,
          // fillColor: barsColor,
        },
      },
    };
    this.updateIndicatorsTheme(this.currentTheme);
  }

  @bind
  private logCandle(action: string, x: IChartItem) {
    candlesLogger.log(
      `[${action} candle]`,
      new Date(x.ts).toString(),
      '[O: ' + x.open + ' H: ' + x.high + ' L: ' + x.low + ' C: ' + x.close + ' V: ' + x.volume + ']',
    );
  }

  @bind
  private handleWindowResize() {
    // fixes chart doesn't get updated after container width change
    // specificallly: after mobile orientation change
    if (this.placeBlock) {
      const { offsetWidth: currentContainerWidth } = this.placeBlock;
      if (this.chartWidth !== currentContainerWidth) {
        this.chartWidth = currentContainerWidth;
        this.gChart.update();
      }
    }
  }

  @bind
  private mHandlePlaceBlockTouchStart() {
    this.mLongTouchTimer = setTimeout(this.mFreezeChart, 500);
  }

  @bind
  private mHandlePlaceBlockTouchEnd() {
    this.mClearLongTouchTimerAndUnfreezeChart();
  }

  @bind
  private mHandlePlaceBlockTouchCancel() {
    this.mClearLongTouchTimerAndUnfreezeChart();
  }

  private mClearLongTouchTimerAndUnfreezeChart() {
    this.mClearLongTouchTimer();
    if (this.state.mIsChartFrozenByLongTouch) {
      this.mUnfreezeChart();
    }
  }

  @bind
  private mHandlePlaceBlockTouchMove() {
    this.mClearLongTouchTimer();
  }

  @bind
  private mFreezeChart() {
    this.setState({ mIsChartFrozenByLongTouch: true }, this.mHandleFreezeByLongTouchToggle);
  }

  @bind
  private mUnfreezeChart() {
    this.setState({ mIsChartFrozenByLongTouch: false }, this.mHandleFreezeByLongTouchToggle);
  }

  @bind
  private mHandleFreezeByLongTouchToggle() {
    const { mIsChartFrozenByLongTouch } = this.state;
    if (mIsChartFrozenByLongTouch) {
      this.mDisableGesturesForPanels();
    } else {
      this.mEnableGesturesForPanels();
    }
    const { mOnFreezeByLongTouchToggle } = this.props;
    if (mOnFreezeByLongTouchToggle) {
      mOnFreezeByLongTouchToggle();
    }
  }

  private mDisableGesturesForPanels() {
    const { panels } = this.gChart.chartPanelsContainer;
    panels.forEach((panel: any) => {
      const gesturesContainer = panel._gestures;
      const { gestures } = gesturesContainer;
      this.mSavedPanelsGestures = this.mSavedPanelsGestures === null
        ? [[...gestures]]
        : [...this.mSavedPanelsGestures, [...gestures]];
      gesturesContainer.remove(gestures);
    });
  }

  private mEnableGesturesForPanels() {
    const { panels } = this.gChart.chartPanelsContainer;
    panels.forEach((panel: any, index: number) => {
      const gesturesContainer = panel._gestures;
      if (this.mSavedPanelsGestures && this.mSavedPanelsGestures[index]) {
        gesturesContainer.add(this.mSavedPanelsGestures[index]);
      } else {
        console.warn(`Can't find a gesture with index ${index} in ${this.mSavedPanelsGestures}.`);
      }
    });
    this.mSavedPanelsGestures = null;
  }

  private mClearLongTouchTimer() {
    if (this.mLongTouchTimer !== null) {
      clearTimeout(this.mLongTouchTimer);
      this.mLongTouchTimer = null;
    }
  }
}

export { IProps };
export default StockChart;
