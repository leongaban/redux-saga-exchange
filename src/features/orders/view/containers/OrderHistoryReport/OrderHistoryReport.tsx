import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';

import { IArchiveOrderColumnData, IArchiveOrder } from 'shared/types/models';
import { settingsDefaults, defaultRecordsPerPageSelectConfig } from 'shared/constants';
import { IAppReduxState } from 'shared/types/app';
import { ISortInfo } from 'shared/types/ui';
import {
  selectors as openOrdersSelectors,
  actions as openOrdersActions,
} from 'services/openOrdersDataSource';
import { FilterForm } from 'services/config/view/containers';
import { IOrderHistoryFilter } from 'shared/types/requests';

import OrderHistory from '../OrderHistory/OrderHistory';
import './OrderHistoryReport.scss';

interface IActionProps {
  loadFilteredOrders: typeof openOrdersActions.loadFilteredOrders;
}

interface IStateProps {
  orders: IArchiveOrder[];
  totalPages: number;
  isRequesting: boolean;
}

interface IOwnProps {
  columnsToDisplay?: Record<keyof IArchiveOrderColumnData, boolean>;
}

interface IState {
  filterData: IOrderHistoryFilter;
  page: number;
  perPage: number;
  sort: ISortInfo<IArchiveOrderColumnData>;
}

type IProps = IActionProps & IStateProps & IOwnProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    orders: openOrdersSelectors.selectReportArchiveOrders(state),
    totalPages: openOrdersSelectors.selectReportArchiveOrdersTotalPages(state),
    isRequesting: openOrdersSelectors.selectCommunication(state, 'loadFilteredOrders').isRequesting,
  };
}

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({
    loadFilteredOrders: openOrdersActions.loadFilteredOrders,
  }, dispatch);
}

const b = block('order-history-report');

class OrderHistoryReport extends React.PureComponent<IProps, IState> {

  public state: IState = {
    filterData: {},
    page: 1,
    perPage: defaultRecordsPerPageSelectConfig.initialOption,
    sort: settingsDefaults.orderHistorySortInfo,
  };

  public componentDidMount() {
    this.loadOrders();
  }

  public render() {
    const { orders, isRequesting, columnsToDisplay, totalPages } = this.props;
    const { sort } = this.state;
    return (
      <OrderHistory
        columnsToDisplay={columnsToDisplay}
        orders={orders}
        renderTableHeader={this.renderTableHeader}
        sortInfo={sort}
        onSortInfoChange={this.handleSortInfoChange}
        tableServerPaginationProps={{
          isRequesting,
          onPageRequest: this.handleTablePageRequest,
          totalPages,
        }}
        tableRecordsPerPageSelectConfig={defaultRecordsPerPageSelectConfig}
      />
    );
  }

  @bind
  private renderTableHeader(renderPaginationControls: () => JSX.Element | null) {
    return (
      <div className={b('table-header')()}>
        <div className={b('filter-form')()}>
          <FilterForm
            withHidingCanceledField
            onFormSubmit={this.handleFilterFormSubmit}
          />
        </div>
        <div className={b('pagination-controls')()}>
          {renderPaginationControls()}
        </div>
      </div>
    );
  }

  @bind
  private handleFilterFormSubmit(formData: IOrderHistoryFilter) {
    this.setState({ filterData: formData }, this.loadOrders);
  }

  @bind
  private handleTablePageRequest(page: number, perPage: number) {
    this.setState({ page, perPage }, this.loadOrders);
  }

  @bind
  private handleSortInfoChange(sort: ISortInfo<IArchiveOrderColumnData>) {
    this.setState({ sort }, this.loadOrders);
  }

  @bind
  private loadOrders() {
    const { filterData, page, perPage, sort } = this.state;
    const { loadFilteredOrders } = this.props;
    loadFilteredOrders({
      filters: filterData,
      page,
      perPage,
      sort,
    });
  }
}

export default connect(mapState, mapDispatch)(
  OrderHistoryReport,
);
