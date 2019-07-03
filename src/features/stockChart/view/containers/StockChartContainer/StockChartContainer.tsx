import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import block from 'bem-cn';
import { bind } from 'decko';
import moment from 'moment';

import { StockChart } from 'shared/view/components';
import { IAppReduxState } from 'shared/types/app';
import { UITheme } from 'shared/types/ui';
import { envLogger } from 'shared/helpers/debug';
import {
  IChartItem, IStockChartSettings, IDepthHistory, ICurrencyPair, PeriodicityUnit,
} from 'shared/types/models';
import { actions as chartActions } from 'services/chart/index';
import { selectors as configSelectors } from 'services/config';
import { multiConnect, IMultiConnectProps } from 'shared/helpers/redux/multiConnect';
import { IndicatorType } from 'shared/helpers/indicatorFactory';

import { dateDistances, numOfRequestedCandles } from '../../../constants';
import { IBlockSettings, IReduxState } from '../../../namespace';
import initialState from '../../../redux/initial';
import { selectors, actions } from '../../../redux';
import { MainPanelTitle, MPeriodMenu } from '../../components';
import './StockChartContainer.scss';

interface IState {
  open: IBlockSettings;
  close: IBlockSettings;
  high: IBlockSettings;
  low: IBlockSettings;
  date: IBlockSettings;
  symbol: IBlockSettings;
  mIsChartFrozenByLongTouch: boolean;
}

interface IStateProps {
  chartData: IChartItem[];
  currentCandle: IChartItem;
  depthHistory: IDepthHistory;
  uiTheme: UITheme;
  error?: string;
}

interface IDispatchProps {
  subscribeToEvent: typeof chartActions.subscribeToEvent;
  unsubscribeFromEvent: typeof chartActions.unsubscribeFromEvent;
  openChannel: typeof chartActions.openChannel;
  closeChannel: typeof chartActions.closeChannel;
  reset: typeof actions.reset;
  executeCommand: typeof actions.executeCommand;
}

interface IOwnProps {
  currentCurrencyPair: ICurrencyPair;
  settings: IStockChartSettings;
  isWidgetInFullscreenMode?: boolean;
  useMobileVersion?: boolean;
  onSettingsSave?(settings: IStockChartSettings): void;
  mOnPeriodMenuEntrySelect?(interval: number, periodicity: PeriodicityUnit): void;
}

type IProps = IStateProps & IDispatchProps & IMultiConnectProps & IOwnProps;

const b = block('stock-chart-container');
const requestHistoryLogger = envLogger(__filename, 'requestHistory');

class StockChartContainer extends React.PureComponent<IProps, IState> {
  public state: IState = {
    open: {
      text: '',
      style: {},
    },
    close: {
      text: '',
      style: {},
    },
    high: {
      text: '',
      style: {},
    },
    low: {
      text: '',
      style: {},
    },
    date: {
      text: '',
      style: {},
    },
    symbol: {
      text: '',
      style: {},
    },
    mIsChartFrozenByLongTouch: false,
  };
  private chart: StockChart | null;
  private loadingState: boolean = false;
  private dateFormat: string = 'YYYY-MM-DDTHH:mm:ss';
  private currentPeriodStart: moment.Moment = moment().utc();
  private currentPeriodEnd: moment.Moment = moment().utc();

  public componentDidMount() {
    const { currentCurrencyPair, settings: { interval, periodicity }, reset } = this.props;
    reset();
    this.subscribeToMarket(currentCurrencyPair.id, interval, periodicity);
  }

  public componentWillUnmount() {
    const { currentCurrencyPair, settings: { interval = 1, periodicity = 'm' } } = this.props;
    this.unsubscribeFromMarket(currentCurrencyPair.id, interval, periodicity);
  }

  public componentWillReceiveProps({ currentCurrencyPair, settings, chartData }: IProps) {
    const {
      currentCurrencyPair: prevMarket,
      reset,
      settings: prevSettings,
      chartData: prevChartData = [],
    } = this.props;

    const { periodicity, interval } = settings;
    const { interval: prevInterval, periodicity: prevPeriodicity } = prevSettings;

    /*
      initDataSeries:
        - loads new data (chartData) into the empty (prevChartData.length === 0) chart;
        - there are ONLY two cases when the chart data is empty:
          - chart data is empty at the initial state;
          - chart data becomes empty after interval OR periodicity OR currency pair changing
            (state resets to initial via reset action);
        - therefore prevChartData.length === 0 means that either interval OR periodicity OR currency pair were changed
          but the chart haven't been initialized with new data yet;
        - and chartData.length > 0 means that we didn't reset the state but received new data;

      addHistory:
        - adds new history to the current chart;
        - happens when a timestamp of a current chat data frist candle (prevChartData[0].ts)
          is greater than a timestamp of a received chart data first candle (chartData[0].ts);
     */

    if (this.chart) {
      if (prevChartData.length === 0 && chartData.length > 0) {
        this.chart.initDataSeries(chartData);
      } else if (
        prevChartData.length > 0
        && chartData.length > 0
        && (chartData[0].ts < prevChartData[0].ts)
      ) {
        this.chart.addHistory(chartData);
      }

      const firstCandle: IChartItem = chartData[0] || {
        ts: 0,
        close: 0,
        high: 0,
        low: 0,
        open: 0,
        volume: 0,
      };
      this.currentPeriodStart = moment(firstCandle.ts);
    }

    if (prevMarket.id !== currentCurrencyPair.id ||
      prevPeriodicity !== periodicity ||
      prevInterval !== interval
    ) {
      this.loadingState = true;

      if (this.chart != null) {
        this.chart.clear();
        reset();
      }
      this.unsubscribeFromMarket(prevMarket.id, prevInterval, prevPeriodicity);
      setTimeout(() => this.subscribeToMarket(currentCurrencyPair.id, interval, periodicity), 300);
    } else {
      this.loadingState = false;
    }
  }

  public render() {
    const { error } = this.props;
    return (
      <div className={b()}>
        {this.renderContainerUpperPart()}
        <div className={b('main-content')()}>
          {error
            ? <div className={b('error')()}>{error}</div>
            : this.renderCandleChart()
          }
        </div>
      </div>
    );
  }

  private renderCandleChart() {
    const {
      currentCandle, uiTheme, error, settings, isWidgetInFullscreenMode,
      currentCurrencyPair: { amountScale, priceScale }, useMobileVersion,
    } = this.props;
    const { periodicity, isZoomEnabled, indicators } = settings;
    return (
      <div className={b('stock-chart', { visible: !error })()}>
        <StockChart
          amountAccuracy={amountScale}
          priceAccuracy={priceScale}
          currentCandle={currentCandle}
          periodicity={periodicity}
          indicators={indicators}
          onHistoryRequest={this.handleHistoryRequest}
          theme={uiTheme}
          onIndicatorRemovedByUser={this.handleIndicatorRemovedByUser}
          onMainPanelTextUpdate={this.handleMainPanelTextUpdate}
          onMainPanelCssUpdate={this.handleMainPanelCssUpdate}
          ref={chart => { this.chart = chart; }}
          zoomEnabled={isZoomEnabled}
          isFullscreenModeEnabled={isWidgetInFullscreenMode}
          useMobileVersion={useMobileVersion}
          mOnFreezeByLongTouchToggle={useMobileVersion ? this.mHandleChartFreezeByLongTouchToggle : void 0}
        />
      </div>
    );
  }

  private renderContainerUpperPart() {
    const { open, high, close, date, low, symbol, mIsChartFrozenByLongTouch } = this.state;
    const { error, useMobileVersion, mOnPeriodMenuEntrySelect, settings: { interval, periodicity } } = this.props;
    const isMainPanelTitleVisible = useMobileVersion
      ? mIsChartFrozenByLongTouch
      : !error;
    const upperPartContent: JSX.Element | undefined  = (() => {
      if (isMainPanelTitleVisible) {
        return (
          <MainPanelTitle
            open={open}
            close={close}
            high={high}
            low={low}
            date={date}
            symbol={symbol}
            loadingState={this.loadingState}
            useMobileVersion={useMobileVersion}
          />
        );
      } else if (useMobileVersion && mOnPeriodMenuEntrySelect) {
        return <MPeriodMenu interval={interval} periodicity={periodicity} onEntrySelect={mOnPeriodMenuEntrySelect}/>;
      }
    })();
    return (
      <div className={b('upper-part')()}>
        {upperPartContent}
      </div>
    );
  }

  @bind
  private handleMainPanelCssUpdate(values: { [key: string]: string }) {
    this.setState({
      open: { text: this.state.open.text, style: values.open },
      close: { text: this.state.close.text, style: values.close },
      high: { text: this.state.high.text, style: values.high },
      low: { text: this.state.low.text, style: values.low },
      symbol: { text: this.state.symbol.text, style: values.symbol },
      date: { text: this.state.date.text, style: values.date },
    });
  }

  @bind
  private handleMainPanelTextUpdate(values: { [key: string]: any }) {
    this.setState({
      open: { text: values.open, style: this.state.open.style },
      close: { text: values.close, style: this.state.close.style },
      high: { text: values.high, style: this.state.high.style },
      low: { text: values.low, style: this.state.low.style },
      symbol: { text: values.symbol, style: this.state.symbol.style },
      date: { text: values.date, style: this.state.date.style },
    });
  }

  @bind
  private resetPeriod() {
    const { settings: { periodicity } } = this.props;
    this.currentPeriodStart = moment().utc().subtract(dateDistances[periodicity], 'days');
    this.currentPeriodEnd = moment().utc();
  }

  @bind
  private requestHistory(
    dateFrom: moment.Moment,
    dateTo: moment.Moment,
    count: number = numOfRequestedCandles,
  ) {
    const { executeCommand, instanceKey = '', currentCurrencyPair, settings: { periodicity, interval } } = this.props;
    const fullMarketChannelAddr = `${currentCurrencyPair.id}@${interval}${periodicity}`;
    requestHistoryLogger.log('[requestHistory (' + fullMarketChannelAddr + ') ' +
      dateFrom.toString() + ' : ' + dateTo.toString() + ']');
    executeCommand('ChartHistory',
      {
        Spec: `${fullMarketChannelAddr}`,
        From: dateFrom.format(this.dateFormat),
        To: dateTo.format(this.dateFormat),
        Count: count,
      }, instanceKey);
  }

  @bind
  private handleHistoryRequest() {
    const { chartData, settings: { interval, periodicity } } = this.props;
    if (chartData.length > 0) {
      const earliestLoadedDate = moment(chartData[0].ts);
      const dateTo: moment.Moment = earliestLoadedDate
        .utc()
        .subtract(interval, periodicity as moment.unitOfTime.DurationConstructor);
      const dateFrom: moment.Moment = dateTo.clone().subtract(dateDistances[periodicity], 'days');
      this.requestHistory(dateFrom, dateTo);
    } else {
      console.error('>>> handleHistoryRequest chartData is empty');
      console.error('>>> handleHistoryRequest in StockChartX', this.chart);
    }
  }

  private subscribeToMarket(marketId: string, interval: number, periodicity: string) {
    const { instanceKey = '' } = this.props;
    const fullMarketChannelAddr = `${marketId}@${interval}${periodicity}`;
    this.resetPeriod();
    this.props.openChannel(`Chart.${fullMarketChannelAddr}`, () => {
      this.requestHistory(this.currentPeriodStart, this.currentPeriodEnd);
    }, instanceKey);

    this.props.subscribeToEvent(`Chart.${fullMarketChannelAddr}`, instanceKey);
  }

  private unsubscribeFromMarket(marketId: string, interval: number, periodicity: string) {
    const { instanceKey = '' } = this.props;
    const fullMarketChannelAddr = `${marketId}@${interval}${periodicity}`;
    this.props.closeChannel(`Chart.${fullMarketChannelAddr}`, instanceKey);
    this.props.unsubscribeFromEvent(`Chart.${fullMarketChannelAddr}`, instanceKey);
  }

  @bind
  private handleIndicatorRemovedByUser(indicatorName: IndicatorType) {
    const { onSettingsSave, settings } = this.props;
    const { indicators } = settings;
    if (onSettingsSave) {
      onSettingsSave({ ...settings, indicators: indicators.filter(x => x !== indicatorName) });
    }
  }

  @bind
  private mHandleChartFreezeByLongTouchToggle() {
    this.setState((prevState: IState) => ({
      mIsChartFrozenByLongTouch: !prevState.mIsChartFrozenByLongTouch,
    }));
  }
}

function mapStateToProps(state: IReduxState, appState: IAppReduxState): IStateProps {
  return {
    chartData: selectors.selectChartData(state),
    currentCandle: selectors.selectCurrentCandle(state),
    error: selectors.selectError(state),
    depthHistory: selectors.selectDepthHistory(state),
    uiTheme: configSelectors.selectUITheme(appState),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): IDispatchProps {
  return bindActionCreators({
    subscribeToEvent: chartActions.subscribeToEvent,
    unsubscribeFromEvent: chartActions.unsubscribeFromEvent,
    openChannel: chartActions.openChannel,
    closeChannel: chartActions.closeChannel,
    executeCommand: actions.executeCommand,
    reset: actions.reset,
  }, dispatch);
}

export default multiConnect
  <IReduxState, IStateProps, IDispatchProps, IOwnProps>
  (['stockChartWidget'], initialState, mapStateToProps, mapDispatchToProps)(StockChartContainer);
