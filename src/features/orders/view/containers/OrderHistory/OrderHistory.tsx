import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import { createSelector } from 'reselect';
import * as R from 'ramda';
import { connect } from 'react-redux';

import { IAppReduxState } from 'shared/types/app';
import moment from 'services/moment';
import {
  IArchiveOrder,
  IAchiveOrderColumns,
  IArchiveOrderColumnData,
  IArchiveOrderNonColumnData,
  IActiveOrder,
  CurrencyPairByIDGetter,
  OrderValueFormatter,
} from 'shared/types/models';
import { Table, ITableServerPaginationProps, ITableRecordsPerPageSelectConfig } from 'shared/view/components';
import { floorFloatToFixed } from 'shared/helpers/number';
import { ISortInfo } from 'shared/types/ui';
import { Button } from 'shared/view/elements';
import { selectors as configSelectors } from 'services/config';
import { getTableRowHoverColor } from 'shared/view/styles/themes';
import { archiveOrderColumnsTitles as titles, settingsDefaults } from 'shared/constants';
import { transformAssetName } from 'shared/helpers/converters';

import { selectors } from '../../../redux';
import './OrderHistory.scss';

interface IOwnProps {
  columnsToDisplay?: Record<keyof IArchiveOrderColumnData, boolean>;
  sortInfo?: ISortInfo<IArchiveOrderColumnData>;
  isActionColumnShown?: boolean; // TODO should be removed
  orders: IArchiveOrder[];
  tableServerPaginationProps?: ITableServerPaginationProps;
  tableRecordsPerPageSelectConfig?: ITableRecordsPerPageSelectConfig;
  filterPredicate?(order: IArchiveOrder): boolean;
  renderTableHeader?(renderPaginationControls: () => JSX.Element | null): JSX.Element;
  onSortInfoChange?(sortInfo: ISortInfo<IArchiveOrderColumnData>): void;
  onShareButtonClick?(message: string): void;
}

interface IStateProps {
  currentOrder: IActiveOrder | IArchiveOrder;
  formatPrice: OrderValueFormatter;
  formatVolume: OrderValueFormatter;
  getCurrencyPairById: CurrencyPairByIDGetter;
}

type IProps = IStateProps & IOwnProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    currentOrder: selectors.selectCurrentOrder(state),
    formatPrice: configSelectors.selectOrderPriceFormatter(state),
    formatVolume: configSelectors.selectOrderVolumeFormatter(state),
    getCurrencyPairById: configSelectors.selectCurrencyPairByIDGetter(state),
  };
}

const b = block('order-history');

const OrderHistoryTable = Table as new () => Table<IArchiveOrderColumnData, IArchiveOrderNonColumnData, 'actions'>;

class Orders extends React.PureComponent<IProps> {

  private columns: IAchiveOrderColumns = {
    datePlaced: {
      title: () => titles.datePlaced,
      // width: 10,
      sortKind: 'date',
      renderCell: (record: IArchiveOrder) => <span>{moment(record.datePlaced).format('HH:mm:ss DD.MM')}</span>,
    },
    market: {
      title: () => titles.market,
      // width: 8,
      renderCell: (record: IArchiveOrder) => (
        <span
          style={{
            fontWeight: 500,
          }}
        >
          {transformAssetName(record.market.replace('_', '/'))}
        </span>
      ),
    },
    type: {
      title: () => titles.type,
      // width: 6,
      renderCell: (record: IArchiveOrder) => (
        <span className={b('order-side-record', { side: record.type })()}>{record.type}</span>
      ),
    },
    limitPrice: {
      title: () => titles.limitPrice,
      renderCell: ({ limitPrice, market }: IArchiveOrder) => {
        return <span>{this.props.formatPrice(market, limitPrice)}</span>;
      },
    },
    filledVolume: {
      title: () => titles.filledVolume,
      renderCell: ({ filledVolume, market }: IArchiveOrder) => {
        return (
          <span>{`${this.props.formatVolume(market, filledVolume)}`}</span>
        );
      },
    },
    filledPercent: {
      title: () => titles.filledPercent,
      renderCell: ({ filledPercent }: IArchiveOrder) => {
        return (
          <span>{`${floorFloatToFixed(filledPercent, 0)}%`}</span>
        );
      },
    },
    remainingVolume: {
      title: () => titles.remainingVolume,
      renderCell: ({ remainingVolume, market }: IArchiveOrder) => {
        return (
          <span>{`${this.props.formatVolume(market, remainingVolume)}`}</span>
        );
      },
    },
    remainingPercent: {
      title: () => titles.remainingPercent,
      renderCell: ({ remainingPercent }: IArchiveOrder) => {
        return (
          <span>{`${floorFloatToFixed(remainingPercent, 0)}%`}</span>
        );
      },
    },
    fullVolume: {
      title: () => titles.fullVolume,
      renderCell: ({ fullVolume, market }: IArchiveOrder) => {
        return <span>{this.props.formatVolume(market, fullVolume)}</span>;
      },
    },
    total: {
      title: () => titles.total,
      renderCell: ({ total, market }: IArchiveOrder) => {
        const asset = market.split('_')[1];
        return <span>{`${this.props.formatPrice(market, total)} ${asset}`}</span>;
      },
    },
    fee: {
      title: () => titles.fee,
      renderCell: ({ fee, market, type }: IArchiveOrder) => {
        const isBuy = type === 'buy';
        const pair = this.props.getCurrencyPairById(market);
        if (pair) {
          const asset = isBuy ? pair.baseCurrency : pair.counterCurrency;
          return <span>{`${floorFloatToFixed(fee, 8)} ${asset}`}</span>;
        }
        return ' - ';
      },
    },
    orderType: {
      // width: 6,
      title: () => titles.orderType,
    },
    status: {
      // width: 6,
      title: () => titles.status,
    },
  };

  private extraColumns = {
    actions: {
      title: () => 'Actions',
      isSortable: false,
      width: 5,
      renderCell: this.renderActions,
    },
  };

  private selectFilteredColumns = createSelector(
    () => this.columns,
    (props: IProps) => props.columnsToDisplay,
    (columns, columnsToDisplay = settingsDefaults.orderHistoryVisibleColumns): Partial<IAchiveOrderColumns> =>
      R.pickBy((_, key: keyof typeof columns) => columnsToDisplay[key], columns),
  );

  public render() {
    const {
      orders, sortInfo, onSortInfoChange, isActionColumnShown, renderTableHeader,
      tableServerPaginationProps, filterPredicate, tableRecordsPerPageSelectConfig,
    } = this.props;

    const records = filterPredicate
      ? orders.filter(filterPredicate)
      : orders;

    return (
      <div className={b()}>
        <OrderHistoryTable
          columns={this.selectFilteredColumns(this.props)}
          records={records}
          sortInfo={sortInfo}
          onSortInfoChange={onSortInfoChange}
          minWidth={this.calculateMinWidth()}
          extraColumns={isActionColumnShown ? this.extraColumns : undefined}
          renderHeader={renderTableHeader}
          serverPaginationProps={tableServerPaginationProps}
          recordsPerPageSelectConfig={tableRecordsPerPageSelectConfig}
          recordIDColumn="id"
          getRowHoverColor={getTableRowHoverColor}
        />
      </div>
    );
  }

  @bind
  private calculateMinWidth() {
    const columnsAmount = Object.keys(this.selectFilteredColumns(this.props)).length;
    if (columnsAmount > 10) {
      return 108;
    } else if (columnsAmount > 7) {
      return 90;
    } else if (columnsAmount > 4) {
      return 79;
    } else {
      return 50;
    }
  }

  @bind
  private renderActions(order: IArchiveOrder): JSX.Element {
    const { onShareButtonClick } = this.props;
    const handleShareButtonClick = this.makeShareButtonClickHandler(order, onShareButtonClick);
    return (
      <div className={b('actions')()}>
        {onShareButtonClick && (
          <div className={b('button', { share: true })()}>
            <Button onClick={handleShareButtonClick} size="small" color="text-blue">
              Share
            </Button>
          </div>)}
      </div>
    );
  }

  @bind
  private handleShareButtonClick(
    currentOrder: IArchiveOrder,
    onShareButtonClick?: (message: string) => void,
  ) {
    const { orderType, market, fullVolume, limitPrice, datePlaced } = currentOrder;
    const message = `${orderType}, ${market}, ${fullVolume}, ${limitPrice}, ${moment(datePlaced).format('L HH:mm')}`;
    onShareButtonClick && onShareButtonClick(message);
  }

  @bind
  private makeShareButtonClickHandler(
    currentOrder: IArchiveOrder,
    onShareButtonClick?: (message: string) => void,
  ) {
    return () => {
      this.handleShareButtonClick(currentOrder, onShareButtonClick);
    };
  }
}

export default connect(mapState)(Orders);
