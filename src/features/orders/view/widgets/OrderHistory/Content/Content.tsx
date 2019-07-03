import * as React from 'react';
import { connect } from 'react-redux';
import { bind } from 'decko';

import { IAppReduxState } from 'shared/types/app';
import {
  IArchiveOrder,
  IAchiveOrderColumns,
  IOrderHistorySettings,
  IWidgetContentProps,
} from 'shared/types/models';
import { ISortInfo } from 'shared/types/ui';
import { selectors as openOrdersSelectors } from 'services/openOrdersDataSource';

import { OrderHistory } from '../../../containers';

interface IStateProps {
  orders: IArchiveOrder[];
}

type IProps = IStateProps & IWidgetContentProps<IOrderHistorySettings>;

function mapState(state: IAppReduxState): IStateProps {
  return {
    orders: openOrdersSelectors.selectArchiveOrders(state),
  };
}

class OrderHistoryWidget extends React.PureComponent<IProps> {

  public render() {
    const {
      settings: { sort, hideOtherPairs, ...columns }, copyToChatMessage, orders,
    } = this.props;

    return (
      <OrderHistory
        orders={orders}
        columnsToDisplay={columns}
        sortInfo={sort}
        filterPredicate={hideOtherPairs ? this.filterOtherPredicate : void 1}
        onSortInfoChange={this.handleSortInfoChange}
        onShareButtonClick={copyToChatMessage}
      />
    );
  }

  @bind
  private handleSortInfoChange(sort: ISortInfo<IAchiveOrderColumns>) {
    this.props.onSettingsSave({ sort });
  }

  @bind
  private filterOtherPredicate(x: IArchiveOrder) {
    return x.market === this.props.currentCurrencyPair.id;
  }
}

export default (
  connect(mapState, () => ({}))(
    OrderHistoryWidget,
  ));
