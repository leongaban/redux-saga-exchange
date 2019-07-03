import * as React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { bind } from 'decko';

import { containersProvider, IContainerTypes } from 'core';
import { Preloader } from 'shared/view/elements';
import {
  IReportingSettings, IWidgetContentProps, IArchiveOrder, ReportingContentKind,
  IArchiveOrderColumnData, IActiveOrderColumnData, IOperationHistoryColumnData,
} from 'shared/types/models';
import { ISortInfo } from 'shared/types/ui';
import { IAppReduxState } from 'shared/types/app';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { selectors as openOrdersDSSelectors } from 'services/openOrdersDataSource';

import './Content.scss';

interface IContainerProps {
  OrderList: IContainerTypes['OrderList'];
  OrderHistory: IContainerTypes['OrderHistory'];
  OperationHistory: IContainerTypes['OperationHistory'];
}

interface IStateProps {
  archiveOrders: IArchiveOrder[];
}

type IProps = IContainerProps & ITranslateProps & IWidgetContentProps<IReportingSettings> & IStateProps;

const b = block('reporting-content');

function mapState(state: IAppReduxState): IStateProps {
  return {
    archiveOrders: openOrdersDSSelectors.selectArchiveOrders(state),
  };
}

class Content extends React.PureComponent<IProps> {
  private contentRenderers: Record<ReportingContentKind, () => JSX.Element> = {
    'order-list': this.renderOrderList,
    'order-history': this.renderOrderHistory,
    'operation-history': this.renderOperationHistory,
  };

  public render() {
    const { settings: { activeReportingContentKind } } = this.props;
    return (
      <div className={b()}>
        {this.contentRenderers[activeReportingContentKind]()}
      </div>
    );
  }

  @bind
  private renderOrderList() {
    const {
      OrderList, settings: {
        orderList: { shouldOpenCancelOrderModal, sort, ...columns },
      },
    } = this.props;

    return (
      <OrderList
        columns={columns}
        sortInfo={sort}
        onCancelConfirmationModalDisable={this.handleCancelConfirmationModalDisable}
        shouldOpenCancelOrderModal={shouldOpenCancelOrderModal}
        filterPredicate={this.makeFilterOtherPredicate()}
        onSortInfoChange={this.handleOrderListSortInfoChange}
      />
    );
  }

  private makeFilterOtherPredicate() {
    if (this.props.settings.hideOtherPairs) {
      return this.filterOtherPredicate;
    }
  }

  @bind
  private filterOtherPredicate(x: { market: string }) {
    return x.market === this.props.currentCurrencyPair.id;
  }

  @bind
  private renderOrderHistory() {
    const {
      OrderHistory, archiveOrders, settings: {
        orderHistory: { sort, ...columns }
      },
    } = this.props;

    return (
      <OrderHistory
        columnsToDisplay={columns}
        sortInfo={sort}
        orders={archiveOrders}
        filterPredicate={this.makeFilterOtherPredicate()}
        onSortInfoChange={this.handleOrderHistorySortInfoChange}
      />
    );
  }

  @bind
  private renderOperationHistory() {
    const {
      OperationHistory,
      settings: { operationHistory: { sort } },
    } = this.props;

    return (
      <OperationHistory
        onSortInfoChange={this.handleOperationHistorySortInfoChange}
        sortInfo={sort}
      />
    );
  }

  @bind
  private handleOrderHistorySortInfoChange(sort: ISortInfo<IArchiveOrderColumnData>) {
    this.props.onSettingsSave({ orderHistory: { sort } });
  }

  @bind
  private handleOrderListSortInfoChange(sort: ISortInfo<IActiveOrderColumnData>) {
    this.props.onSettingsSave({ orderList: { sort } });
  }

  @bind
  private handleOperationHistorySortInfoChange(sort: ISortInfo<IOperationHistoryColumnData>) {
    this.props.onSettingsSave({ operationHistory: { sort } });
  }

  @bind
  private handleCancelConfirmationModalDisable() {
    const { onSettingsSave, settings } = this.props;
    onSettingsSave({
      ...settings,
      orderList: { ...settings.orderList, shouldOpenCancelOrderModal: false },
    });
  }
}

export default (
  containersProvider(['OrderList', 'OrderHistory', 'OperationHistory'], <Preloader isShow />)(
    connect(mapState, () => ({}))(
      i18nConnect(
        Content,
      ))));
