import * as React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { bind } from 'decko';

import moment from 'services/moment';
import { selectors as configSelectors } from 'services/config';
import { fractionalPartLengths } from 'shared/constants';
import { IAppReduxState } from 'shared/types/app';
import { floorFloatToFixed } from 'shared/helpers/number';
import {
  IExtendedTrade,
  IExtendedTradeHistoryColumnData,
  IExtendedTradeHistoryColumns,
  IExtendedTradeHistoryNonColumnData,
  ICurrencyPair,
} from 'shared/types/models';
import { ISortInfo } from 'shared/types/ui';
import { Table, ITableRecordsPerPageSelectConfig, TableIDColumn } from 'shared/view/components';

import { actions, selectors } from './../../../redux';
import './ExtendedTradeHistory.scss';

interface IStateProps {
  totalPages: number;
  currencyPairs: ICurrencyPair[];
  isRequesting: boolean;
}

interface IActionProps {
  reset: typeof actions.reset;
}

interface IOwnProps {
  trades: IExtendedTrade[];
  tableRecordsPerPageSelectConfig: ITableRecordsPerPageSelectConfig;
  sortInfo: ISortInfo<IExtendedTradeHistoryColumnData>;
  onPageRequest(page: number, perPage: number): void;
  renderTableHeader(renderPaginationControls: () => JSX.Element | null): JSX.Element;
  onSortChange(sortInfo: ISortInfo<IExtendedTradeHistoryColumnData>): void;
}

type IProps = IOwnProps & IStateProps & IActionProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    totalPages: selectors.selectExtendedTradesTotalPages(state),
    isRequesting: selectors.selectLoadCommunication(state).isRequesting,
    currencyPairs: configSelectors.selectCurrencyPairs(state),
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators({
    reset: actions.reset,
  }, dispatch);
}

const b = block('extended-trade-history');

class ExtendedTradeHistory extends React.PureComponent<IProps> {

  private columns: IExtendedTradeHistoryColumns = {
    tradeSeq: {
      title: () => 'TradeSeq',
      renderCell: ({ tradeSeq }: IExtendedTrade) => {
        return <span>{tradeSeq}</span>;
      },
      isSortable: false,
    },
    market: {
      title: () => 'Market',
      renderCell: ({ market }: IExtendedTrade) => {
        return <span>{market}</span>;
      },
      isSortable: false,
    },
    exchangeRate: {
      title: () => 'Exchange rate',
      renderCell: ({ exchangeRate, market }: IExtendedTrade) => {
        return <span>{this.formatValue(exchangeRate, true, market)}</span>;
      },
      isSortable: false,
    },
    amount: {
      title: () => 'Amount',
      renderCell: ({ amount, market }: IExtendedTrade) => {
        return <span>{this.formatValue(amount, false, market)}</span>;
      },
      isSortable: false,
    },
    comission: {
      title: () => 'Comission',
      renderCell: ({ comission }: IExtendedTrade) => {
        return <span>{comission || '-'}</span>;
      },
      isSortable: false,
    },
    date: {
      title: () => 'Date and Time',
      renderCell: (record: IExtendedTrade) => {
        return <span>{moment(record.date).format('HH:mm:ss.SSS')}</span>;
      },
      isSortable: false,
    },
  };

  public componentWillUnmount() {
    this.props.reset();
  }

  public render() {
    const {
      trades, renderTableHeader, onPageRequest, isRequesting, tableRecordsPerPageSelectConfig,
      onSortChange, totalPages, sortInfo,
    } = this.props;
    return (
      <div className={b()}>
        <Table<IExtendedTradeHistoryColumnData, IExtendedTradeHistoryNonColumnData, ''>
          columns={this.columns}
          records={trades}
          getRowColor={this.getTradeRowColor}
          sortInfo={sortInfo}
          renderHeader={renderTableHeader}
          recordsPerPageSelectConfig={tableRecordsPerPageSelectConfig}
          serverPaginationProps={{ onPageRequest, isRequesting, totalPages }}
          onSortInfoChange={onSortChange}
          recordIDColumn={TableIDColumn.FromIndex}
        />
      </div>
    );
  }

  @bind
  private getTradeRowColor(record: IExtendedTrade) {
    return record.type === 'buy' ? 'rgba(0, 177, 66, 0.15)' : 'rgba(223, 42, 65, 0.15)';
  }

  @bind
  private formatValue(value: number, isPrice: boolean, market: string) {
    const { currencyPairs } = this.props;
    const pair = currencyPairs.find(x => x.id.toLowerCase() === market.toLowerCase());
    if (pair) {
      const accuracy = isPrice ? pair.priceScale : pair.amountScale;
      return floorFloatToFixed(value, accuracy);
    }
    return floorFloatToFixed(value, fractionalPartLengths.cryptocurrency);
  }
}

export { ExtendedTradeHistory };
export default connect(mapState, mapDispatch)(ExtendedTradeHistory);
