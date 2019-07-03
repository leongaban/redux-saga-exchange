import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import moment from 'moment';

import { IAssetsInfoMap } from 'shared/types/models';
import { Select } from 'shared/view/elements';
import { formatMoney } from 'shared/helpers/liquidityPool';
import { lpCurrencySelections } from 'shared/mocks/liquidityPool';
import { transformAssetName } from 'shared/helpers/converters';

import './TotalPayout.scss';

interface IProps {
  assetsInfo: IAssetsInfoMap;
  conversionCurrency: string;
  title: string;
  usersHistoricalPayouts: number;
  setConvertationCurrency(currency: string): void;
}

interface IState {
  gmtTime: string;
}

const b = block('total-payout');

const getGMTTime = () => moment().utc().format('HH:mm');

class TotalPayout extends React.PureComponent<IProps, IState> {
  public state: IState = {
    gmtTime: getGMTTime()
  };

  private currencies: string[] = lpCurrencySelections;
  private interval: NodeJS.Timer;

  constructor(props: IProps) {
    super(props);

    this.state = {
      gmtTime: getGMTTime()
    };
  }

  public render() {
    const { conversionCurrency } = this.props;
    const { gmtTime } = this.state;

    return (
      <div className={b('row')()}>
        <div className={b('cell', { 'total-payout': true })()}>
          <section className={b('cell-header')()}>
            {this.renderMyReturn()}
            <h4 className={b('time-label')()}>{gmtTime} GMT</h4>
            <div className={b('currency-selector')()}>
              <Select
                options={this.currencies}
                optionValueKey={this.getOptionValue}
                selectedOption={conversionCurrency}
                onSelect={this.handleCurrencySelect}
              />
            </div>
          </section>
        </div>
      </div>
    );
  }

  public componentDidMount() {
    const updateGMTTime = () => this.setState({ gmtTime: getGMTTime() });
    this.interval = setInterval(updateGMTTime, 60 * 1000);
  }

  public componentWillUnmount() {
    clearInterval(this.interval);
  }

  private renderMyReturn() {
    const {
      assetsInfo,
      conversionCurrency: currency,
      usersHistoricalPayouts: historicalPayouts,
      title
    } = this.props;

    return (
      <div className={b('title-row')()}>
        <span className={b('view-desktop')()}>
          <div className={b('title')()}>{title}:</div> {formatMoney(historicalPayouts, currency, assetsInfo, 'header')}
        </span>
        <span className={b('view-mobile')()}>
        <div className={b('title')()}>{title}:</div> {formatMoney(historicalPayouts, currency, assetsInfo)}
        </span>
      </div>
    );
  }

  @bind
  private getOptionValue(type: string) {
    return transformAssetName(type);
  }

  @bind
  private handleCurrencySelect(type: string) {
    this.props.setConvertationCurrency(type);
  }
}

export default TotalPayout;
