import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';
import block from 'bem-cn';

import featureConnect from 'core/FeatureConnector';
import * as features from 'features';
import { defaultExtendedTradeHistorySortInfo } from 'shared/constants';
import Preloader from 'shared/view/elements/Preloader/Preloader';
import { ITableRecordsPerPageSelectConfig } from 'shared/view/components';
import { IExtendedTradeHistoryColumnData, IExtendedTrade } from 'shared/types/models';
import { ISortInfo } from 'shared/types/ui';
import { Action } from 'shared/types/redux';
import { IAppReduxState } from 'shared/types/app';
import { FilterForm } from 'services/config/view/containers';

import { ReportContainer, ExportToXLSxButton } from '../../components';
import { IFilterForm } from '../../../namespace';
import './TradeHistoryLayout.scss';

interface IOwnProps {
  tradeHistoryFeatureEntry: features.tradeHistory.Entry;
}

interface IState {
  filterData?: IFilterForm;
  page: number;
  perPage: number;
  sort: ISortInfo<IExtendedTradeHistoryColumnData>;
}

interface IActionProps {
  load: Action<features.tradeHistory.namespace.ILoad>;
}

interface IStateProps {
  trades: IExtendedTrade[];
}

type IProps = IOwnProps & IStateProps & IActionProps;

function mapDispatch(dispatch: Dispatch<any>, props: IOwnProps): IActionProps {
  return bindActionCreators(props.tradeHistoryFeatureEntry.actions, dispatch);
}

function mapState(state: IAppReduxState, ownProps: IOwnProps): IStateProps {
  const {
    tradeHistoryFeatureEntry: { selectors: tradeHistorySelectors },
  } = ownProps;
  return {
    trades: tradeHistorySelectors.selectExtendedTrades(state),
  };
}

const b = block('trade-history-layout');

const tableRecordsPerPageSelectConfig: ITableRecordsPerPageSelectConfig = {
  initialOption: 20,
  options: [20, 30, 50, 100],
};

class TradeHistoryLayout extends React.PureComponent<IProps, IState> {

  public state: IState = {
    page: 1,
    perPage: tableRecordsPerPageSelectConfig.initialOption,
    sort: defaultExtendedTradeHistorySortInfo,
  };

  public componentDidMount() {
    this.loadExtendedTrades();
  }

  public render() {
    const { trades, tradeHistoryFeatureEntry: { containers: { ExtendedTradeHistory } } } = this.props;
    const { sort } = this.state;
    return (
      <ReportContainer
        title="Trade history"
        renderHeaderRightPart={this.renderHeaderRightControls}
      >
        <ExtendedTradeHistory
          trades={trades}
          renderTableHeader={this.renderTableHeader}
          tableRecordsPerPageSelectConfig={tableRecordsPerPageSelectConfig}
          onPageRequest={this.handleTablePageRequest}
          onSortChange={this.handleSortChange}
          sortInfo={sort}
        />
      </ReportContainer>
    );
  }

  @bind
  private renderHeaderRightControls() {
    return (
      <ExportToXLSxButton data={this.props.trades} filename="tradeHistory" />
    );
  }

  @bind
  private renderTableHeader(renderPaginationControls: () => JSX.Element | null) {
    return (
      <div className={b('table-header')()}>
        <div className={b('filter-form')()}>
          <FilterForm onFormSubmit={this.handleFilterFormSubmit} />
        </div>
        <div className={b('pagination-controls')()}>
          {renderPaginationControls()}
        </div>
      </div>
    );
  }

  @bind
  private handleSortChange(sort: ISortInfo<IExtendedTradeHistoryColumnData>) {
    this.setState(prevState => ({ sort }), this.loadExtendedTrades);
  }

  @bind
  private handleFilterFormSubmit(formData: IFilterForm) {
    this.setState(prevState => ({ filterData: formData }), this.loadExtendedTrades);
  }

  @bind
  private handleTablePageRequest(page: number, perPage: number) {
    this.setState(prevState => ({ page, perPage }), this.loadExtendedTrades);
  }

  @bind
  private loadExtendedTrades() {
    const { load } = this.props;
    const { filterData, page, sort, perPage } = this.state;
    load({
      filter: filterData,
      page,
      perPage,
      sortColumn: sort.column,
      sortDirection: sort.direction,
    });
  }
}

export default (
  featureConnect({
    tradeHistoryFeatureEntry: features.tradeHistory.loadEntry,
  }, <Preloader isShow />)(
    connect(mapState, mapDispatch)(
      TradeHistoryLayout,
    )));
