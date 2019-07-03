import * as React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { bind } from 'decko';

import { containersProvider, IContainerTypes } from 'core';
import { IAppReduxState } from 'shared/types/app';
import { IActiveOrder, OrderValueFormatter, IPaginatedData } from 'shared/types/models';
import { defaultRecordsPerPageSelectConfig } from 'shared/constants';
import { selectors as configSelectors } from 'services/config';

import { selectors, actions } from './../../../redux';
import './OpenOrdersReport.scss';

interface IOwnProps {
  userID: string;
}

interface IStateProps {
  formatPrice: OrderValueFormatter;
  formatVolume: OrderValueFormatter;
  areOpenOrdersRequesting: boolean;
  openOrders: IPaginatedData<IActiveOrder[]>;
}

interface IActionProps {
  loadOpenOrders: typeof actions.loadOpenOrders;
}

interface IProviderProps {
  OpenOrdersTable: IContainerTypes['OpenOrdersTable'];
}

type IProps = IStateProps & IActionProps & IProviderProps & IOwnProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    formatPrice: configSelectors.selectOrderPriceFormatter(state),
    formatVolume: configSelectors.selectOrderVolumeFormatter(state),
    areOpenOrdersRequesting: selectors.selectCommunication(state, 'loadOpenOrders').isRequesting,
    openOrders: selectors.selectOpenOrders(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators({
    loadOpenOrders: actions.loadOpenOrders,
  }, dispatch);
}

const b = block('open-orders-report');

class OpenOrdersReport extends React.PureComponent<IProps> {

  public componentDidMount() {
    const { userID, loadOpenOrders } = this.props;
    const { initialOption } = defaultRecordsPerPageSelectConfig;
    loadOpenOrders({ userID, page: 1, perPage: initialOption });
  }

  public render() {
    const {
      openOrders: { data, pagination: { total, page } }, areOpenOrdersRequesting,
      OpenOrdersTable,
    } = this.props;
    return (
      <div className={b()}>
        <OpenOrdersTable
          records={data}
          renderHeader={this.renderHeader}
          recordsPerPageSelectConfig={defaultRecordsPerPageSelectConfig}
          serverPaginationProps={{
            isRequesting: areOpenOrdersRequesting,
            onPageRequest: this.handlePageRequest,
            activePage: page,
            totalPages: total,
          }}
        />
      </div>
    );
  }

  @bind
  private handlePageRequest(page: number, perPage: number) {
    const { userID, loadOpenOrders } = this.props;
    loadOpenOrders({ userID, perPage, page });
  }

  @bind
  private renderHeader(renderPaginationControls: () => JSX.Element | null) {
    return (
      <div className={b('header')()}>
        {renderPaginationControls()}
      </div>
    );
  }
}

export default containersProvider(['OpenOrdersTable'], <div />)(connect(mapState, mapDispatch)(OpenOrdersReport));
