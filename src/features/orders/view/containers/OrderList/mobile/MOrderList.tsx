import * as React from 'react';
import block from 'bem-cn';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bind } from 'decko';
import { createSelector } from 'reselect';

import { IAppReduxState } from 'shared/types/app';
import {
  IMTableColumn, IMTableRowSubcontent, ITablePaginationData, ITablePaginationState, ISortInfo,
} from 'shared/types/ui';
import { IActiveOrder, ICurrencyPair, IArchiveOrder, OrderValueFormatter } from 'shared/types/models';
import { Button } from 'shared/view/elements';
import { MTable, ModalCancel } from 'shared/view/components';
import { sortArray } from 'shared/helpers/sort';
import { createPagesNumberSelector, createPaginatedRecordsSelector } from 'shared/helpers/selectorCreators';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { selectors as openOrdersDSSelectors } from 'services/openOrdersDataSource';
import { selectors as configSelectors } from 'services/config';
import moment from 'services/moment';

import { actions, selectors } from '../../../../redux';
import './MOrderList.scss';

interface IStateProps {
  currencyPairs: ICurrencyPair[];
  orders: IActiveOrder[];
  paginationState: ITablePaginationState;
  formatPrice: OrderValueFormatter;
  formatVolume: OrderValueFormatter;
  isCancelModalOpen: boolean;
  currentOrder: IActiveOrder | IArchiveOrder;
}

interface IActionProps {
  cancelOrder: typeof actions.cancelOrder;
  cancelAllOrders: typeof actions.cancelAllOrders;
  setActiveOrdersTable: typeof actions.setActiveOrdersTable;
  setIsCancelModalOpen: typeof actions.setIsCancelModalOpen;
  setCurrentOrder: typeof actions.setCurrentOrder;
}

type IProps = IStateProps & IActionProps & ITranslateProps;

function mapDispatch(dispatch: Dispatch<any>): IActionProps {
  return bindActionCreators(actions, dispatch);
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    currencyPairs: configSelectors.selectCurrencyPairs(state),
    orders: openOrdersDSSelectors.selectActiveOrders(state),
    paginationState: selectors.selectActiveOrdersTable(state),
    formatPrice: configSelectors.selectOrderPriceFormatter(state),
    formatVolume: configSelectors.selectOrderVolumeFormatter(state),
    isCancelModalOpen: selectors.selectIsCancelModalOpen(state),
    currentOrder: selectors.selectCurrentOrder(state),
  };
}

const b = block('m-order-list');

const ordersSortInfo: ISortInfo<IActiveOrder> = {
  column: 'datePlaced',
  kind: 'date',
  direction: 'descend',
};

class MOrderList extends React.PureComponent<IProps> {
  private selectOrders = (props: IProps) => props.orders;
  private selectPaginationState = (props: IProps) => props.paginationState;

  /* tslint:disable:member-ordering */

  private selectPagesNumber = createPagesNumberSelector(
    this.selectOrders,
    this.selectPaginationState,
  );

  private selectPaginationData = createSelector(
    this.selectPagesNumber,
    this.selectPaginationState,
    (pagesNumber, state): ITablePaginationData => {
      return {
        pagesNumber,
        state,
        renderHeader: this.renderHeader,
        onPageChange: this.handlePageChange,
        onRecordsPerPageSelect: this.handleRecordsPerPageSelect,
      };
    }
  );

  private selectSortedOrders = createSelector(
    this.selectOrders,
    (orders) => sortArray(orders, ordersSortInfo),
  );

  private selectPaginatedOrders = createPaginatedRecordsSelector(
    this.selectSortedOrders,
    this.selectPaginationData,
  );

  private columns: Array<IMTableColumn<IActiveOrder>> = [
    {
      getTitle: () => 'MARKET',
      renderCell: ({ market, type }: IActiveOrder) => (
        <>
          <div className={b('market-cell-content')()}>
            {market.replace('_', '/')}
          </div>
          <div className={b('order-side-cell-content', { side: type })()}>
            {type}
          </div>
        </>
      ),
      width: { unit: 'rem', value: 6 },
    },

    {
      getTitle: () => 'PRICE/AMOUNT',
      renderCell: ({ limitPrice, fullVolume, market }: IActiveOrder) => (
        <>
          <div className={b('price-cell-content')()}>
            {this.props.formatPrice(market, limitPrice)}
          </div>
          <div className={b('amount-cell-content')()}>
            {this.props.formatVolume(market, fullVolume)}
          </div>
        </>
      ),
    },

    {
      getTitle: () => '',
      renderCell: (x: IActiveOrder) => (
        <div className={b('cancel-button')()} onClick={this.makeCancelButtonClickHandler(x)}>
          <Button color="text-blue" size="small" textTransform="capitalize">
            {this.props.translate('SHARED:BUTTONS:CANCEL')}
          </Button>
        </div>
      ),
      width: { unit: 'rem', value: 4 },
    },
  ];

  private rowSubcontent: IMTableRowSubcontent<IActiveOrder> = {
    rows: [
      {
        getTitle: () => 'Date placed',
        renderValue: (record: IActiveOrder) => <span>{moment(record.datePlaced).format('DD.MM.YY HH:mm')}</span>,
      },

      {
        getTitle: () => 'Filled',
        renderValue: ({ market, filledVolume }: IActiveOrder) => this.props.formatVolume(market, filledVolume),
      },

      {
        getTitle: () => 'Filled %',
        renderValue: ({ filledPercent }: IActiveOrder) => filledPercent.toFixed(0),
      },

      {
        getTitle: () => 'Unfilled',
        renderValue: ({ market, remainingVolume }: IActiveOrder) => this.props.formatVolume(market, remainingVolume),
      },

      {
        getTitle: () => 'Unfilled %',
        renderValue: ({ remainingPercent }: IActiveOrder) => remainingPercent.toFixed(0),
      },

      {
        getTitle: () => 'Order type',
        renderValue: ({ orderType }: IActiveOrder) => orderType,
      }
    ]
  };

  public render() {
    const { isCancelModalOpen } = this.props;

    return (
      <div className={b()}>
        <MTable<IActiveOrder>
          getRecordID={this.getActiveOrderID}
          columns={this.columns}
          rowSubContent={this.rowSubcontent}
          paginationData={this.selectPaginationData(this.props)}
          records={this.selectPaginatedOrders(this.props)}
        />
        {isCancelModalOpen && this.renderCancelWindow()}
      </div>
    );
  }

  // TODO in this window we do not see the order that we are going to cancel
  private renderCancelWindow() {
    const { currentOrder } = this.props;

    const handleConfirmModalClick = this.makeConfirmCancelModalClickHandler(currentOrder.id);
    const { isCancelModalOpen } = this.props;
    return (
      <ModalCancel
        isOpen={isCancelModalOpen}
        title="Cancel order"
        modalText="Are you sure you want to cancel this order?"
        onCancel={this.handleCancelModalCancelButtonCick}
        onConfirm={handleConfirmModalClick}
      />
    );
  }

  @bind
  private handleCancelModalCancelButtonCick() {
    this.props.setIsCancelModalOpen({isOpen: false});
  }

  private makeConfirmCancelModalClickHandler(orderID: number) {
    return () => this.props.cancelOrder(orderID);
  }

  @bind
  private handlePageChange(page: number) {
    this.props.setActiveOrdersTable({ activePage: page });
  }

  @bind
  private handleRecordsPerPageSelect(recordsPerPage: number) {
    this.props.setActiveOrdersTable({ recordsPerPage });
  }

  @bind
  private renderHeader(renderPaginationControls: () => JSX.Element) {
    const { translate: t, cancelAllOrders } = this.props;
    return (
      <div className={b('table-header')()}>
        {renderPaginationControls()}
        <div className={b('cancel-all-button')()}>
          <Button color="red" size="small" textTransform="capitalize" onClick={cancelAllOrders}>
            {t('ORDERS:CANCEL-ALL-BUTTON-LABEL')}
          </Button>
        </div>
      </div>
    );
  }

  @bind
  private getActiveOrderID(x: IActiveOrder) {
    return x.id;
  }

  private makeCancelButtonClickHandler(x: IActiveOrder) {
    return () => {
      this.props.setCurrentOrder(x);
      this.props.setIsCancelModalOpen({isOpen: true});
    };
  }
}

export default (
  connect(mapState, mapDispatch)(
    i18nConnect(
      MOrderList,
    )));
