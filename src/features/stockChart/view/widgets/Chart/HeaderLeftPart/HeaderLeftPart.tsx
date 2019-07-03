import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import * as R from 'ramda';
import { bindActionCreators, Dispatch } from 'redux';

import { IAppReduxState } from 'shared/types/app';
import { notDraggableClassName } from 'shared/constants';
import { WidgetTitle, Tabs } from 'shared/view/elements';
import { multiConnect, IMultiConnectProps } from 'shared/helpers/redux/multiConnect';
import {
  IStockChartSettings, IHeaderLeftPartWithSettingsProps, ChartKind, PeriodicityUnit,
  BarStyle,
} from 'shared/types/models/widgets';
import { floorFloatToFixed } from 'shared/helpers/number';

import { selectors as orderBookDSSelectors } from 'services/orderBookDataSource';
import { i18nConnect, ITranslateProps } from 'services/i18n';
import { IndicatorType } from 'shared/helpers/indicatorFactory';
import { ITab } from 'shared/types/ui';
import { convertMarketFromUnderscoreToSlash, transformAssetName } from 'shared/helpers/converters';

import { initialState, actions, selectors } from '../../../../redux';
import { IReduxState } from '../../../../namespace';
import { BarStyleMenu, PeriodMenu, IndicatorsMenu } from '../../../components';
import { InfoBoxes } from '../../../containers';
import './HeaderLeftPart.scss';

interface IStateProps {
  maxBidPrice: number;
  minAskPrice: number;
  isIndicatorsDialogOpened: boolean;
}

interface IDispatchProps {
  setModalDisplayStatus: typeof actions.setModalDisplayStatus;
}

interface IOwnProps extends IHeaderLeftPartWithSettingsProps<IStockChartSettings> { }

type Props =
  IOwnProps & IStateProps & IDispatchProps & IStockChartSettings & IMultiConnectProps
  & ITranslateProps;

const chartKinds: ChartKind[] = ['candlesticks', 'depth'];

const chartKindI18nKeys: Record<ChartKind, string> = {
  candlesticks: 'STOCK-CHART:HEADER-LEFT-PART:TEXT-OF-TAB-FOR-CANDLESTICK-CHART',
  depth: 'STOCK-CHART:HEADER-LEFT-PART:TEXT-OF-TAB-FOR-DEPTH-CHART',
};

function mapStateToProps(state: IReduxState, appState: IAppReduxState): IStateProps {
  return {
    maxBidPrice: orderBookDSSelectors.selectMaxBidPrice(appState),
    minAskPrice: orderBookDSSelectors.selectMinAskPrice(appState),
    isIndicatorsDialogOpened: selectors.selectIndicatorsDialogState(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): IDispatchProps {
  return bindActionCreators({
    setModalDisplayStatus: actions.setModalDisplayStatus,
  }, dispatch);
}

const b = block('chart-widget-header-left-part');

class Header extends React.PureComponent<Props> {

  private currentCurrencyId: string;

  public componentWillReceiveProps({ currentCurrencyPair }: Props) {
    if (this.currentCurrencyId !== currentCurrencyPair.id) {
      this.currentCurrencyId = currentCurrencyPair.id;
    }
  }

  public render() {
    return (
      <div className={b()}>
        <div className={b('header-sections')()}>
          {this.renderTopHeaderSection()}
          {this.renderBottomHeaderSection()}
        </div>
        {this.renderButtons()}
      </div>
    );
  }

  private renderTopHeaderSection() {
    const { currentCurrencyPair: { id }, translate, onSettingsSave, settings } = this.props;

    const { interval, periodicity, activeChartKind, barStyle } = settings;

    const chartKindTabs: ITab[] = chartKinds.map((x: ChartKind): ITab => ({
      active: x === activeChartKind,
      disabled: false,
      key: x,
      onClick: () => onSettingsSave({ activeChartKind: x }),
      title: translate(chartKindI18nKeys[x]),
    }));

    return (
      <div className={b('top-header-section')()}>
        <WidgetTitle textTransform="initial">
          <span className={b('header-title')()}>
            {transformAssetName(convertMarketFromUnderscoreToSlash(id))}
          </span>
        </WidgetTitle>
        <div className={b('menu-wrapper').mix(notDraggableClassName)()}>
          <PeriodMenu
            interval={interval}
            periodicity={periodicity}
            onEntryItemClick={this.handlePeriodMenuEntryClick}
          />
        </div>
        <div className={b('menu-wrapper').mix(notDraggableClassName)()}>
          <IndicatorsMenu
            onMenuEntryClick={this.handleSelectIndicator}
            onButtonClick={this.isTradingViewChart() ? this.handleIndicatorsBtnClick : void (0)}
            kind={this.isTradingViewChart() ? 'trading-view' : 'stockChart-x'}
          />
        </div>
        {
          this.isTradingViewChart()
            ? (
              <div className={b('menu-wrapper').mix(notDraggableClassName)()}>
                <BarStyleMenu
                  selected={barStyle}
                  onEntryItemClick={this.handleBarStyleMenuEntryClick}
                />
              </div>
            ) : null
        }
        <div className={b('chart-kind-tabs').mix(notDraggableClassName)()}>
          <Tabs tabs={chartKindTabs} />
        </div>
      </div>
    );
  }

  private renderBottomHeaderSection() {
    const { currentCurrencyPair } = this.props;
    return (
      <div className={b('bottom-header-section').mix(notDraggableClassName)()}>
        <InfoBoxes currentCurrencyPair={currentCurrencyPair} withBoldValues />
      </div>
    );
  }

  private renderButtons() {
    const { currentCurrencyPair, minAskPrice, maxBidPrice } = this.props;
    const loading = this.currentCurrencyId !== currentCurrencyPair.id;

    return (
      <div className={b('big-buttons-holder').mix(notDraggableClassName)()}>
        <button
          className={b('big-button', { green: true })()}
          onClick={this.makePriceButtonClickHandler(minAskPrice, 'buy')}
        >
          {loading ? '-' : this.renderNumber(this.formatPrice(minAskPrice))}
          <div>BUY</div>
        </button>
        <button
          className={b('big-button', { red: true })()}
          onClick={this.makePriceButtonClickHandler(maxBidPrice, 'sell')}
        >
          {loading ? '-' : this.renderNumber(this.formatPrice(maxBidPrice))}
          <div>SELL</div>
        </button>
      </div>
    );
  }

  // TODO NEED Add format big data
  private makePriceButtonClickHandler(value: number, orderSide: 'buy' | 'sell') {
    return () => this.props.copyOrderToModal({
      orderSide,
      price: this.formatPrice(+value),
    });
  }

  private renderNumber(val: string = '0', precision: number = 2, upSize: number = 4) {
    const splittedVal: string[] = val.split('.', 2);
    const left = splittedVal[0].split('');
    const r = splittedVal[1] || '';
    const right = (r + new Array(precision + 1).join('0'))
      .substr(0, r.length < precision ? precision : r.length)
      .split('');
    //   x.xx => X.XX
    // x.xxxx => x.XXXX
    //   xxxx => xxXX.00

    // [7076] => {left: 7076, r: '00', right: ['0', '0']}
    // [0.00023] => {left": 0, r: '00023', right: ['0','0','0','2','3']}
    // [0.01] => {left: 0, r: '01', right: ['0','1']}
    const rightPart = right.splice(-upSize);
    const leftPart = rightPart.length < upSize ? left.splice(-upSize + rightPart.length) : [];
    return (
      <span>
        {left.join('')}
        {leftPart.length > 0 && <span className={b('upper-number')()}>{leftPart.join('')}</span>}
        .
        {right.join('')}
        {rightPart.length > 0 && <span className={b('upper-number')()}>{rightPart.join('')}</span>}
      </span>
    );
  }

  @bind
  private handlePeriodMenuEntryClick(newInterval: number, newPeriodicity: PeriodicityUnit) {
    const { onSettingsSave, settings } = this.props;
    onSettingsSave({ ...settings, periodicity: newPeriodicity, interval: newInterval });
  }

  @bind
  private handleSelectIndicator(indicator: IndicatorType) {
    const { onSettingsSave, settings: { indicators } } = this.props;
    if (R.contains(indicator, indicators)) {
      onSettingsSave({ indicators: indicators.filter(x => x !== indicator) });
    } else {
      onSettingsSave({ indicators: [...indicators, indicator] });
    }
  }

  @bind
  private handleBarStyleMenuEntryClick(barStyle: BarStyle) {
    this.props.onSettingsSave({ barStyle });
  }

  @bind
  private formatPrice(value: number) {
    const { currentCurrencyPair: { priceScale } } = this.props;
    return floorFloatToFixed(value, priceScale);
  }

  @bind
  private handleIndicatorsBtnClick() {
    const { isIndicatorsDialogOpened, setModalDisplayStatus } = this.props;
    setModalDisplayStatus({
      name: 'indicatorsDialog',
      status: !isIndicatorsDialogOpened,
    });
  }

  @bind
  private isTradingViewChart() {
    const { settings: { candlesticksChartKind, activeChartKind } } = this.props;
    return candlesticksChartKind === 'trading-view' && activeChartKind === 'candlesticks';
  }
}

export default (
  multiConnect(['stockChartWidget'], initialState, mapStateToProps, mapDispatchToProps)(
    i18nConnect(
      Header,
    )));
