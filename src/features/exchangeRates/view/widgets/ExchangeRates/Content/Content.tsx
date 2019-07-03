import * as React from 'react';
import { bind } from 'decko';

import {
  IExchangeRate, IExchangeRatesSettings, IWidgetContentProps, IExchangeRateColumnData,
} from 'shared/types/models';
import { ISortInfo } from 'shared/types/ui';

import ExchangeRates from '../../../containers/ExchangeRates/ExchangeRates';

type IProps = IWidgetContentProps<IExchangeRatesSettings>;

class ExchangeRatesWidget extends React.PureComponent<IProps> {

  public render() {
    const {
      currentCurrencyPair,
      settings: { sort, currentMarketId: _, ...columnsToDisplay },
    } = this.props;
    return (
      <ExchangeRates
        currentCurrencyPair={currentCurrencyPair}
        columnsToDisplay={columnsToDisplay}
        sortInfo={sort}
        onSelect={this.handleSelectRecord}
        onSortInfoChange={this.handleSortInfoChange}
      />
    );
  }

  @bind
  private handleSelectRecord(currentMarket: IExchangeRate) {
    this.props.onSettingsSave({ currentMarketId: currentMarket.market });
  }

  @bind
  private handleSortInfoChange(sort: ISortInfo<IExchangeRateColumnData>) {
    this.props.onSettingsSave({ sort });
  }
}

export default ExchangeRatesWidget;
