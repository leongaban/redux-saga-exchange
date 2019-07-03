import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';

import { IArchiveOrderColumnData, IArchiveOrder, IPaginatedData } from 'shared/types/models';
import { defaultRecordsPerPageSelectConfig, settingsDefaults } from 'shared/constants';
import { IContainerTypes, containersProvider } from 'core';
import { IAppReduxState } from 'shared/types/app';
import { ISortInfo } from 'shared/types/ui';
import { Preloader } from 'shared/view/elements';
import { FilterForm } from 'services/config/view/containers';
import { IOrderHistoryFilter } from 'shared/types/requests';

import { actions, selectors } from '../../../redux';
import './UserOrderHistory.scss';

interface IActionProps {
  loadUserArchiveOrders: typeof actions.loadUserArchiveOrders;
}

interface IProviderProps {
  OrderHistory: IContainerTypes['OrderHistory'];
}

interface IStateProps {
  orders: IPaginatedData<IArchiveOrder[]>;
  isRequesting: boolean;
}

interface IOwnProps {
  userID: string;
}

interface IState {
  filterData: IOrderHistoryFilter;
  sort: ISortInfo<IArchiveOrderColumnData>;
}

type IProps = IActionProps & IStateProps & IOwnProps & IProviderProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    orders: selectors.selectUserArchiveOrders(state),
    isRequesting: selectors.selectCommunication(state, 'loadUserArchiveOrders').isRequesting,
  };
}

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({
    loadUserArchiveOrders: actions.loadUserArchiveOrders,
  }, dispatch);
}

const b = block('user-order-history');

class UserOrderHistory extends React.PureComponent<IProps, IState> {

  public state: IState = {
    filterData: {},
    sort: settingsDefaults.orderHistorySortInfo,
  };

  public componentDidMount() {
    this.loadOrders();
  }

  public render() {
    const { orders: { data, pagination: { total } }, isRequesting, OrderHistory } = this.props;
    const { sort } = this.state;
    return (
      <div className={b()}>
        <OrderHistory
          columnsToDisplay={settingsDefaults.orderHistoryVisibleColumns}
          orders={data}
          renderTableHeader={this.renderTableHeader}
          sortInfo={sort}
          onSortInfoChange={this.handleSortInfoChange}
          tableServerPaginationProps={{
            isRequesting,
            onPageRequest: this.handleTablePageRequest,
            totalPages: total,
          }}
          tableRecordsPerPageSelectConfig={defaultRecordsPerPageSelectConfig}
        />
      </div>
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
    this.loadOrders(page, perPage);
  }

  @bind
  private handleSortInfoChange(sort: ISortInfo<IArchiveOrderColumnData>) {
    this.setState({ sort }, this.loadOrders);
  }

  @bind
  private loadOrders(page?: number, perPage?: number) {
    const { filterData, sort } = this.state;
    const { loadUserArchiveOrders, userID, orders: { pagination } } = this.props;
    loadUserArchiveOrders({
      filters: filterData,
      page: page || pagination.page,
      perPage: perPage || pagination.perPage,
      sort,
      userID,
    });
  }
}

export default (
  containersProvider(['OrderHistory'], <Preloader isShow />)(
    connect(mapState, mapDispatch)(
      UserOrderHistory,
    ),
  )
);
