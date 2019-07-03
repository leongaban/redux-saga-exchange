import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as R from 'ramda';
import { createSelector } from 'reselect';

import { IArchiveOrder, OrderValueFormatter, CurrencyPairByIDGetter } from 'shared/types/models';
import { IAppReduxState } from 'shared/types/app';
import { IMTableColumn, IMTableRowSubcontent, ITablePaginationState, ITablePaginationData } from 'shared/types/ui';
import { ICommunication } from 'shared/types/redux';
import { MTable } from 'shared/view/components';
import moment from 'services/moment';
import { selectors as configSelectors } from 'services/config';
import { selectors as openOrdersSelectors, actions as openOrdersActions } from 'services/openOrdersDataSource';
import { transformAssetName, convertMarketFromUnderscoreToSlash } from 'shared/helpers/converters';
import { archiveOrderColumnsTitles as titles, settingsDefaults } from 'shared/constants';
import { floorFloatToFixed } from 'shared/helpers/number';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { Checkbox } from 'shared/view/elements';

import './MOrderHistory.scss';
import { selectors, actions } from '../../../../redux';

interface IStateProps {
  orders: IArchiveOrder[];
  formatPrice: OrderValueFormatter;
  formatVolume: OrderValueFormatter;
  getCurrencyPairById: CurrencyPairByIDGetter;
  paginationState: ITablePaginationState;
  areCanceledOrdersHidden: boolean;
  totalPages: number;
  loadFilteredOrdersCommunication: ICommunication;
}

interface IActionProps {
  setOrderHistoryTable: typeof actions.setOrderHistoryTable;
  setAreCanceledOrdersHidden: typeof actions.setAreCanceledOrdersHidden;
  loadFilteredOrders: typeof openOrdersActions.loadFilteredOrders;
}

type IProps = IStateProps & IActionProps & ITranslateProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    orders: openOrdersSelectors.selectReportArchiveOrders(state),
    totalPages: openOrdersSelectors.selectReportArchiveOrdersTotalPages(state),
    loadFilteredOrdersCommunication: openOrdersSelectors.selectCommunication(state, 'loadFilteredOrders'),
    formatPrice: configSelectors.selectOrderPriceFormatter(state),
    formatVolume: configSelectors.selectOrderVolumeFormatter(state),
    getCurrencyPairById: configSelectors.selectCurrencyPairByIDGetter(state),
    paginationState: selectors.selectOrderHistoryTable(state),
    areCanceledOrdersHidden: selectors.selectAreCanceledOrdersHidden(state),
  };
}

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators({
    setOrderHistoryTable: actions.setOrderHistoryTable,
    setAreCanceledOrdersHidden: actions.setAreCanceledOrdersHidden,
    loadFilteredOrders: openOrdersActions.loadFilteredOrders,
  }, dispatch);
}

const b = block('m-order-history');

class MOrderHistory extends React.PureComponent<IProps> {

  private selectPaginationData = createSelector(
    (props: IProps) => props.totalPages,
    (props: IProps) => props.paginationState,
    (props: IProps) => props.loadFilteredOrdersCommunication.isRequesting,
    (pagesNumber, state, isRequesting): ITablePaginationData => {
      return {
        pagesNumber,
        state,
        isRequesting,
        renderHeader: this.renderHeader,
        onPageChange: this.handlePageChange,
        onRecordsPerPageSelect: this.handleRecordsPerPageSelect,
      };
    }
  );

  private columns: Array<IMTableColumn<IArchiveOrder>> = [
    {
      getTitle: () => 'DATE/MARKET',
      renderCell: ({ datePlaced, market }: IArchiveOrder) => {
        const date = moment(datePlaced).format('DD.MM.YY HH:mm');
        const formatMarketName = R.compose(convertMarketFromUnderscoreToSlash, transformAssetName);
        return this.renderTableCell(date, formatMarketName(market));
      },
      width: { unit: 'rem', value: 9 },
    },
    {
      getTitle: () => 'TOTAL/SIDE',
      renderCell: ({ total, type, market }: IArchiveOrder) => {
        const { formatPrice } = this.props;
        const formattedTotal = formatPrice(market, total);
        const side = <span className={b(type)()}>{type}</span>;
        return this.renderTableCell(formattedTotal, side);
      },
    },
    {
      getTitle: () => 'FILLED/STATUS',
      renderCell: ({ filledVolume, status, market }: IArchiveOrder) => {
        const { formatVolume } = this.props;
        const formattedVolume = formatVolume(market, filledVolume);
        return this.renderTableCell(formattedVolume, status);
      },
      rightAligned: true,
    },
  ];

  private rowSubcontent: IMTableRowSubcontent<IArchiveOrder> = {
    rows: [
      {
        getTitle: () => titles.limitPrice,
        renderValue: ({ limitPrice, market }: IArchiveOrder) => this.props.formatPrice(market, limitPrice),
      },
      {
        getTitle: () => titles.filledPercent,
        renderValue: ({ filledPercent }: IArchiveOrder) => floorFloatToFixed(filledPercent, 0),
      },
      {
        getTitle: () => titles.fullVolume,
        renderValue: ({ fullVolume, market }: IArchiveOrder) => this.props.formatVolume(market, fullVolume),
      },
      {
        getTitle: () => titles.fee,
        renderValue: ({ fee, market, type }: IArchiveOrder) => {
          const isBuy = type === 'buy';
          const pair = this.props.getCurrencyPairById(market);
          if (pair) {
            const asset = isBuy ? pair.baseCurrency : pair.counterCurrency;
            const accuracy = isBuy ? pair.priceScale : pair.amountScale;
            return `${floorFloatToFixed(fee, accuracy)} ${asset}`;
          }
          return ' - ';
        },
      },
      {
        getTitle: () => titles.orderType,
        renderValue: ({ orderType }: IArchiveOrder) => orderType,
      },
    ],
  };

  public componentDidMount() {
    const { areCanceledOrdersHidden, paginationState: { recordsPerPage } } = this.props;
    this.loadOrders(1, areCanceledOrdersHidden, recordsPerPage);
  }

  public render() {
    const { orders } = this.props;
    return (
      <div className={b()}>
        <MTable
          columns={this.columns}
          rowSubContent={this.rowSubcontent}
          records={orders}
          getRecordID={this.getRecordID}
          paginationData={this.selectPaginationData(this.props)}
        />
      </div>
    );
  }

  private renderTableCell(mainContent: string, subContent: string | JSX.Element) {
    return (
      <div className={b('table-cell')()}>
        <div className={b('table-cell-main-content')()}>
          {mainContent}
        </div>
        <div className={b('table-cell-sub-content')()}>
          {subContent}
        </div>
      </div>
    );
  }

  @bind
  private getRecordID({ id }: IArchiveOrder) {
    return id;
  }

  @bind
  private renderHeader(renderPaginationControls: () => JSX.Element) {
    const { translate: t, areCanceledOrdersHidden } = this.props;
    return (
      <div className={b('table-header')()}>
        {renderPaginationControls()}
        <div className={b('hide-canceled-checkbox')()}>
          <Checkbox
            label={t('REPORTS:HIDE-ALL-CANCELED-ORDERS')}
            onChange={this.handleHideAllCanceledCheckboxChange}
            checked={areCanceledOrdersHidden}
            labelPosition="left"
          />
        </div>
      </div>
    );
  }

  @bind
  private handlePageChange(page: number) {
    const { areCanceledOrdersHidden, paginationState: { recordsPerPage } } = this.props;
    this.loadOrders(page, areCanceledOrdersHidden, recordsPerPage);
  }

  private loadOrders(page: number, areCanceledOrdersHidden: boolean, perPage: number) {
    const { setOrderHistoryTable, loadFilteredOrders } = this.props;
    setOrderHistoryTable({ activePage: page });
    loadFilteredOrders({
      filters: { hideCancelled: areCanceledOrdersHidden },
      page,
      perPage,
      sort: settingsDefaults.orderHistorySortInfo,
    });
  }

  @bind
  private handleRecordsPerPageSelect(recordsPerPage: number) {
    const { setOrderHistoryTable, areCanceledOrdersHidden } = this.props;
    setOrderHistoryTable({ recordsPerPage, activePage: 1 });
    this.loadOrders(1, areCanceledOrdersHidden, recordsPerPage);
  }

  @bind
  private handleHideAllCanceledCheckboxChange() {
    const {
      setAreCanceledOrdersHidden, areCanceledOrdersHidden, paginationState: { activePage, recordsPerPage },
    } = this.props;
    setAreCanceledOrdersHidden(!areCanceledOrdersHidden);
    this.loadOrders(activePage, !areCanceledOrdersHidden, recordsPerPage);
  }
}

export { MOrderHistory };
export default connect(mapState, mapDispatch)(i18nConnect(MOrderHistory));
