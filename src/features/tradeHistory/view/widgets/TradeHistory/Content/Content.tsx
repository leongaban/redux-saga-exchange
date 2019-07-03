import * as React from 'react';
import { bind } from 'decko';

import { IWidgetContentProps, ITradeHistorySettings, ITradeHistoryColumnData } from 'shared/types/models';
import { ISortInfo } from 'shared/types/ui';

import TradeHistory from '../../../containers/TradeHistory/TradeHistory';

class TradeHistoryWidgetContent extends React.PureComponent<IWidgetContentProps<ITradeHistorySettings>> {

  public render() {
    const { settings: { sort }, currentCurrencyPair } = this.props;
    return (
      <TradeHistory
        currentCurrencyPair={currentCurrencyPair}
        sortInfo={sort}
        onSortInfoChange={this.handleSortInfoChange}
      />
    );
  }

  @bind
  private handleSortInfoChange(sort: ISortInfo<ITradeHistoryColumnData>) {
    this.props.onSettingsSave({ sort });
  }
}

export default (
  TradeHistoryWidgetContent
);
