import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import uuid from 'uuid';

import { ICurrencyPair, PeriodicityUnit } from 'shared/types/models';

import { StockChartContainer, InfoBoxes } from '../';
import { chartStaticSettings } from './constants';
import './MCandleChart.scss';

interface IOwnProps {
  currentCurrencyPair: ICurrencyPair;
}

interface IState {
  interval: number;
  periodicity: PeriodicityUnit;
}

type IProps = IOwnProps;

const b = block('m-candle-chart');

class MCandleChart extends React.PureComponent<IProps, IState> {
  public state: IState = {
    interval: 1,
    periodicity: 'd',
  };

  private stockChartInstanceKey: string = uuid();

  public render() {
    const { interval, periodicity } = this.state;
    const { currentCurrencyPair } = this.props;
    return (
      <div className={b()}>
        <div className={b('info-boxes')()}>
          <InfoBoxes currentCurrencyPair={currentCurrencyPair} vertical />
        </div>
        <div className={b('chart')()}>
          <StockChartContainer
            currentCurrencyPair={currentCurrencyPair}
            settings={{ ...chartStaticSettings, interval, periodicity }}
            instanceKey={this.stockChartInstanceKey}
            mOnPeriodMenuEntrySelect={this.onPeriodMenuEntrySelect}
            useMobileVersion
          />
        </div>
      </div>
    );
  }

  @bind
  private onPeriodMenuEntrySelect(newInterval: number, newPeriodicity: PeriodicityUnit) {
    this.setState(() => ({ periodicity: newPeriodicity, interval: newInterval }));
  }
}

export default MCandleChart;
