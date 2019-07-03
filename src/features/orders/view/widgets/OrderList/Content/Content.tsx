import * as React from 'react';
import { bind } from 'decko';

import { IActiveOrderColumnData, IOrderListSettings, IWidgetContentProps, IActiveOrder } from 'shared/types/models';
import { ISortInfo } from 'shared/types/ui';

import { OrderList } from '../../../containers';

type IProps = IWidgetContentProps<IOrderListSettings>;

class OrderListWidget extends React.PureComponent<IProps> {
  public render() {
    const {
      settings: { sort, shouldOpenCancelOrderModal, hideOtherPairs, ...columns },
    } = this.props;

    return (
      <OrderList
        columns={columns}
        filterPredicate={hideOtherPairs ? this.filterOtherPredicate : void 1}
        sortInfo={sort}
        onSortInfoChange={this.handleSortInfoChange}
        onCancelConfirmationModalDisable={this.handleCancelConfirmationModalDisable}
        shouldOpenCancelOrderModal={shouldOpenCancelOrderModal}
      />
    );
  }

  @bind
  private handleSortInfoChange(sort: ISortInfo<IActiveOrderColumnData>) {
    this.props.onSettingsSave({ sort });
  }

  @bind
  private handleCancelConfirmationModalDisable() {
    this.props.onSettingsSave({ shouldOpenCancelOrderModal: false });
  }

  @bind
  private filterOtherPredicate(x: IActiveOrder) {
    return x.market === this.props.currentCurrencyPair.id;
  }
}

export default OrderListWidget;
