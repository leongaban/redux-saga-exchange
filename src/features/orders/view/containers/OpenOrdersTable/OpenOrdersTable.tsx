import * as React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { bind } from 'decko';

import { getTableRowHoverColor } from 'shared/view/styles/themes';
import { Table, ITableRecordsPerPageSelectConfig, ITableServerPaginationProps } from 'shared/view/components';
import {
  IActiveOrder,
  IActiveOrderColumns,
  OrderValueFormatter,
  IActiveOrderColumnData,
  IActiveOrderNonColumnData,
} from 'shared/types/models';
import { ISortInfo } from 'shared/types/ui';
import { IAppReduxState } from 'shared/types/app';
import { transformAssetName } from 'shared/helpers/converters';
import { floorFloatToFixed } from 'shared/helpers/number';
import { activeOrderColumnsTitles as titles } from 'shared/constants';
import { selectors as configSelectors } from 'services/config';
import moment from 'services/moment';

import './OpenOrdersTable.scss';

interface IOwnProps {
  records: Array<IActiveOrderColumnData & IActiveOrderNonColumnData>;
  serverPaginationProps?: ITableServerPaginationProps;
  columnsToDisplay?: Record<keyof IActiveOrderColumns, boolean>;
  recordsPerPageSelectConfig?: ITableRecordsPerPageSelectConfig;
  sortInfo?: ISortInfo<IActiveOrderColumnData>;
  renderActionsCell?(order: IActiveOrder): JSX.Element;
  renderHeader?(renderPaginationControls: () => JSX.Element | null): JSX.Element;
  onSortInfoChange?(sortInfo: ISortInfo<IActiveOrderColumnData>): void;
}

interface IStateProps {
  formatPrice: OrderValueFormatter;
  formatVolume: OrderValueFormatter;
}

type IProps = IStateProps & IOwnProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    formatPrice: configSelectors.selectOrderPriceFormatter(state),
    formatVolume: configSelectors.selectOrderVolumeFormatter(state),
  };
}

const b = block('open-orders-table');

class OpenOrdersTable extends React.PureComponent<IProps> {
  private columns: IActiveOrderColumns = {
    datePlaced: {
      title: () => titles.datePlaced,
      sortKind: 'date',
      renderCell: (record: IActiveOrder) => moment(record.datePlaced).format('HH:mm:ss DD.MM'),
    },
    market: {
      title: () => titles.market,
      renderCell: (record: IActiveOrder) => (
        <span className={b('market')()}>
          {transformAssetName(record.market.replace('_', '/'))}
        </span>
      ),
    },
    type: {
      title: () => titles.type,
      renderCell: (record: IActiveOrder) => (
        <span className={b('order-side', { side: record.type })()}>{record.type}</span>
      ),
    },
    limitPrice: {
      title: () => titles.limitPrice,
      renderCell: ({ limitPrice, market }: IActiveOrder) => this.props.formatPrice(market, limitPrice),
    },
    filledVolume: {
      title: () => titles.filledVolume,
      renderCell: ({ filledVolume, market }: IActiveOrder) => this.props.formatVolume(market, filledVolume),
    },
    filledPercent: {
      title: () => titles.filledPercent,
      renderCell: ({ filledPercent }: IActiveOrder) => `${floorFloatToFixed(filledPercent, 0)}%`,
    },
    remainingVolume: {
      title: () => titles.remainingVolume,
      renderCell: ({ remainingVolume, market }: IActiveOrder) => this.props.formatVolume(market, remainingVolume),
    },
    remainingPercent: {
      title: () => titles.remainingPercent,
      renderCell: ({ remainingPercent }: IActiveOrder) => `${floorFloatToFixed(remainingPercent, 0)}%`,
    },
    fullVolume: {
      title: () => titles.fullVolume,
      renderCell: ({ fullVolume, market }: IActiveOrder) => this.props.formatVolume(market, fullVolume),
    },
    orderType: {
      title: () => titles.orderType,
    },
  };

  private get extraColumns() {
    const { renderActionsCell } = this.props;
    if (renderActionsCell) {
      return {
        actions: {
          title: () => 'Actions',
          width: 10,
          isSortable: false,
          renderCell: renderActionsCell,
        },
      };
    }
  }

  private get filteredColumns() {
    const { columnsToDisplay } = this.props;
    return columnsToDisplay
      ? R.pickBy((_, key: keyof IActiveOrderColumnData) => columnsToDisplay[key])(this.columns)
      : this.columns;
  }

  public render() {
    const {
      records, sortInfo, recordsPerPageSelectConfig, onSortInfoChange, renderHeader,
      serverPaginationProps,
    } = this.props;
    return (
      <div className={b()}>
        <Table<IActiveOrderColumnData, IActiveOrderNonColumnData, 'actions'>
          columns={this.filteredColumns}
          records={records}
          sortInfo={sortInfo}
          recordsPerPageSelectConfig={recordsPerPageSelectConfig}
          onSortInfoChange={onSortInfoChange}
          extraColumns={this.extraColumns}
          minWidth={this.calculateMinWidth()}
          renderHeader={renderHeader}
          recordIDColumn="id"
          getRowHoverColor={getTableRowHoverColor}
          serverPaginationProps={serverPaginationProps}
          shouldShowNumericPaginationControls
        />
      </div>
    );
  }

  @bind
  private calculateMinWidth() {
    const { columnsToDisplay } = this.props;
    if (columnsToDisplay) {
      const columnsAmount = Object.keys(this.columns)
        .filter((key: keyof IActiveOrderColumnData) => columnsToDisplay[key]).length;
      if (columnsAmount > 7) {
        return 90;
      } else if (columnsAmount > 5) {
        return 75;
      } else if (columnsAmount > 3) {
        return 50;
      } else {
        return 40;
      }
    }

    return 90;
  }
}

export default connect(mapState)(OpenOrdersTable);
