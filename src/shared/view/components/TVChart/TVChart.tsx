import React from 'react';
import block from 'bem-cn';
import ReactDOM from 'react-dom';
import { bind } from 'decko';
import * as R from 'ramda';

import { convertMarketFromUnderscoreToSlash, transformAssetName } from 'shared/helpers/converters';
import { PeriodicityUnit, BarStyle, IDataFeed } from 'shared/types/models';
import { UITheme } from 'shared/types/ui';
import { CustomTimezones } from 'shared/types/charting_library';

import { moonTheme, nightTheme, dayTheme } from './themes';
import { barStyleDict } from './constants';
import './TVChart.scss';

const b = block('tv-chart');

interface IProps {
  datafeed: IDataFeed;
  symbol: string;
  interval: number;
  periodicity: PeriodicityUnit;
  containerId?: string;
  indicators: string[];
  barStyle: BarStyle;
  uiTheme: UITheme;
  isIndicatorsDialogOpened: boolean;
  setModalDisplayStatus(isOpened: boolean): void;
  onIndicatorsSave(indicators: string[]): void;
}

class TVChart extends React.PureComponent<IProps> {
  public static defaultProps: Partial<IProps> = {
    containerId: 'tv-chart-container',
  };

  private chartIsReady = false;
  private widget: TradingView.IChartingLibraryWidget;
  private chartIframeBody: Element | null = null;
  private indicatorsDialogRef: Element | null = null;

  public componentDidMount() {
    const {
      containerId, datafeed, symbol, interval, periodicity, indicators = [], barStyle,
      uiTheme,
    } = this.props;

    const theme = this.theme(uiTheme);

    this.widget = new window.TradingView.widget({
      interval: this.convertIntervalToResolution(interval, periodicity),
      symbol: transformAssetName(convertMarketFromUnderscoreToSlash(symbol)),
      container_id: containerId!,
      datafeed,
      debug: false,
      library_path: '/charting_library/',
      locale: 'en',
      autosize: true,
      auto_save_delay: 1,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as CustomTimezones,
      loading_screen: {
        backgroundColor: theme['paneProperties.background'],
      },
      custom_css_url: `${uiTheme}.css`,
      theme: uiTheme === 'day' ? 'Light' : 'Dark',
      disabled_features: [
        'create_volume_indicator_by_default',
        'use_localstorage_for_settings',
        'header_widget',
        'go_to_date',
        'timeframes_toolbar',
        'border_around_the_chart',
        'remove_library_container_border',
        'volume_force_overlay',
        'chart_property_page_background',
        'constraint_dialogs_movement',
      ],
      overrides: this.overrides(uiTheme),
    });

    this.widget.onChartReady(() => {

      const node = ReactDOM.findDOMNode(this);
      if (node instanceof Element) {
        const iframe = node.children[0] as HTMLFrameElement;
        if (iframe !== null && iframe.contentWindow !== null) {
          this.chartIframeBody = iframe.contentWindow.document.body;
        }
      }

      indicators.forEach(indicator => {
        this.widget.chart().createStudy(indicator, false);
      });

      this.setChartType(barStyle);

      this.widget.subscribe('indicators_dialog', this.handleIndicatorsDialogEvent);
      this.widget.subscribe('onAutoSaveNeeded', this.handleAutoSaveNeeded);
      this.widget.subscribe('study', this.handleStudyAdded);

      this.chartIsReady = true;
    });

  }

  public componentWillUnmount() {
    this.widget.remove();
    this.chartIframeBody = null;
  }

  public componentDidUpdate({
    symbol: prevSymbol,
    interval: prevInterval,
    periodicity: prevPeriodicity,
    isIndicatorsDialogOpened: prevShouldIndicatorsModalBeOpened,
    barStyle: prevBarStyle,
    uiTheme: prevUiTheme,
  }: IProps) {
    if (!this.chartIsReady) {
      return;
    }

    const { symbol, interval, periodicity, isIndicatorsDialogOpened, barStyle, uiTheme } = this.props;

    const resolutionString = this.convertIntervalToResolution(interval, periodicity);

    if (symbol !== prevSymbol) {
      // tslint:disable:max-line-length
      this.widget.setSymbol(transformAssetName(convertMarketFromUnderscoreToSlash(symbol)), resolutionString, (...args: any[]) => {
        console.log('>>> cb on setSymbol', resolutionString, transformAssetName(convertMarketFromUnderscoreToSlash(symbol)), args);
      });
    }

    if (interval !== prevInterval || periodicity !== prevPeriodicity) {
      this.widget.chart().setResolution(resolutionString, () => {
        console.log('>>> set resolution, ', this.widget.chart().resolution());
      });
    }

    if (!prevShouldIndicatorsModalBeOpened && isIndicatorsDialogOpened) {
      this.widget.chart().executeActionById('insertIndicator');
    } else if (prevShouldIndicatorsModalBeOpened && !isIndicatorsDialogOpened) {
      this.widget.closePopupsAndDialogs();
    }

    if (prevBarStyle !== barStyle) {
      this.setChartType(barStyle);
    }

    if (prevUiTheme !== uiTheme) {
      this.widget.applyOverrides(this.overrides(uiTheme));
      this.widget.addCustomCSSFile(`${uiTheme}.css`);
      this.widget.changeTheme(uiTheme === 'day' ? 'Light' : 'Dark');
      // TODO https://github.com/tradingview/charting_library/issues/3459
      setTimeout(() => {
        this.setChartType(barStyle);
      }, 0);
    }
  }

  public render() {
    return <div className={b()} id={this.props.containerId} />;
  }

  @bind
  private convertIntervalToResolution(interval: number, periodicity: PeriodicityUnit) {
    switch (periodicity) {
      case 'm':
        return `${interval}`;
      case 'h':
        return `${interval * 60}`;
      case 'd':
        return `${interval}D`;
      case 'w':
        return `${interval}W`;
      case 'M':
        return `${interval}M`;
      default:
        return '1';
    }
  }

  @bind
  private setChartType(barStyle: BarStyle) {
    this.widget.chart().setChartType(barStyleDict[barStyle]);
  }

  private theme(uiTheme: UITheme) {
    switch (uiTheme) {
      case 'night': return nightTheme;
      case 'moon': return moonTheme;
      default: return dayTheme;
    }
  }

  private overrides(uiTheme: UITheme) {
    const theme = this.theme(uiTheme);
    return {
      ...theme,
      'mainSeriesProperties.candleStyle.drawWick': true,
      'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,
      'symbolWatermarkProperties.color': 'rgba(0, 0, 0, 0.00)',
    };
  }

  @bind
  private handleIframeBodyClick(event: MouseEvent) {
    const { setModalDisplayStatus } = this.props;
    if (this.indicatorsDialogRef !== null && this.chartIframeBody !== null) {
      const isIndicatorsDialogOpened = (() => {
        if (this.indicatorsDialogRef.contains(event.target as Node)) {
          const cross = this.indicatorsDialogRef.getElementsByClassName('js-dialog__close')[0];
          if (cross.contains(event.target as Node)) {
            return false;
          }
          return true;
        }
        return false;
      })();
      if (!isIndicatorsDialogOpened) {
        setModalDisplayStatus(isIndicatorsDialogOpened);
        this.indicatorsDialogRef = null;
        this.chartIframeBody.removeEventListener('click', this.handleIframeBodyClick);
      }
    } else {
      console.warn('indicatorsDialogRef is not initialized');
    }
  }

  @bind
  private handleIndicatorsDialogEvent() {
    if (this.chartIframeBody !== null) {
      this.indicatorsDialogRef = this.chartIframeBody.getElementsByClassName('tv-insert-indicator-dialog')[0];
      this.chartIframeBody.addEventListener('click', this.handleIframeBodyClick);
    }
  }

  // TODO: remove handleAutoSaveNeeded after removeStudy event will be introduced
  // in next TVchart library version
  @bind
  private handleAutoSaveNeeded() {
    const { indicators, onIndicatorsSave } = this.props;
    const studies: string[] = this.widget.chart().getAllStudies().map(study => study.name);
    if (!R.equals(indicators, studies)) {
      onIndicatorsSave(studies);
    }
  }

  @bind
  private handleStudyAdded() {
    const { onIndicatorsSave } = this.props;
    // 1. setTimeout - because need to wait till widget will add study to list
    // 2. We have study argument, but it has no proper name to recreate study after reload
    setTimeout(() => {
      const studies: string[] = this.widget.chart().getAllStudies().map(x => x.name);
      onIndicatorsSave(studies);
    }, 0);
  }
}

export default TVChart;
