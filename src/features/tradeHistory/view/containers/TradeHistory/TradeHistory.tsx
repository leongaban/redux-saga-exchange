import * as React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { bind } from 'decko';

import { IAppReduxState } from 'shared/types/app';
import { floorFloatToFixed } from 'shared/helpers/number';
import moment from 'services/moment';
import { Table } from 'shared/view/components';
import { Tooltip } from 'shared/view/elements';
import { selectors as configSelectors } from 'services/config';
import { selectors as miniTickerDataSourceSelectors } from 'services/miniTickerDataSource';
import { CurrencyConverter } from 'services/miniTickerDataSource/namespace';
import {
  ITrade, ITradeHistoryColumnData, ITradeHistoryColumns, ITradeHistoryNonColumnData, ICurrencyPair,
} from 'shared/types/models';
import { ISortInfo, UITheme } from 'shared/types/ui';
import { getColorsFromTheme } from 'shared/view/styles/themes';

import { selectors } from './../../../redux';
import { TradeHistoryDataSource } from '..';

import './TradeHistory.scss';

interface IStateProps {
  trades: ITrade[];
  uiTheme: UITheme;
  convertQuoteCurrencyToUSDT: CurrencyConverter;
}

interface IOwnProps {
  sortInfo: ISortInfo<ITradeHistoryColumnData>;
  currentCurrencyPair: ICurrencyPair;
  onSortInfoChange(sortInfo: ISortInfo<ITradeHistoryColumnData>): void;
}

type IProps = IStateProps & IOwnProps;

function mapState(state: IAppReduxState, ownProps: IOwnProps): IStateProps {
  const { currentCurrencyPair: { counterCurrency } } = ownProps;
  return {
    trades: selectors.selectTrades(state),
    uiTheme: configSelectors.selectUITheme(state),
    convertQuoteCurrencyToUSDT: miniTickerDataSourceSelectors.selectQuoteCurrencyToUSDTConverter(
      state, counterCurrency
    ),
  };
}

const b = block('trade-history');

class TradeHistoryWidget extends React.PureComponent<IProps> {

  private columns: ITradeHistoryColumns = {
    exchangeRate: {
      title: () => 'Exchange rate',
      renderCell: ({ exchangeRate }: ITrade) => {
        const { convertQuoteCurrencyToUSDT } = this.props;
        const convertedQuoteCurrency = convertQuoteCurrencyToUSDT(exchangeRate);
        const tooltipText = convertedQuoteCurrency
          ? `$ ${convertedQuoteCurrency}`
          : '$ 0';
        return (
          <Tooltip position="right" text={tooltipText} withPointer inline>
            <span>{floorFloatToFixed(exchangeRate, this.props.currentCurrencyPair.priceScale)}</span>
          </Tooltip>
        );
      },
      isSortable: false,
    },
    amount: {
      title: () => 'Amount',
      renderCell: ({ amount }: ITrade) => {
        return <span>{floorFloatToFixed(amount, this.props.currentCurrencyPair.amountScale)}</span>;
      },
      isSortable: false,
    },
    date: {
      title: () => 'Time',
      renderCell: (record: ITrade) => {
        return <span>{moment(record.date).format('HH:mm:ss.SSS')}</span>;
      },
      isSortable: false,
    },
  };

  public render() {
    const { trades, onSortInfoChange, sortInfo, currentCurrencyPair: { id } } = this.props;
    return (
      <div className={b()}>
        <Table<ITradeHistoryColumnData, ITradeHistoryNonColumnData, ''>
          columns={this.columns}
          records={trades}
          getRowColor={this.getTableRowColor}
          getRowHoverColor={this.getTableRowHoverColor}
          sortInfo={sortInfo}
          onSortInfoChange={onSortInfoChange}
          recordIDColumn="id"
        />
        <TradeHistoryDataSource currentMarket={id} />
      </div>
    );
  }

  @bind
  private getTableRowColor(record: ITrade) {
    const { uiTheme } = this.props;
    const { transparentGreen, transparentRed } = getColorsFromTheme(uiTheme);
    return record.type === 'buy' ? transparentGreen : transparentRed;
  }

  @bind
  private getTableRowHoverColor(record: ITrade) {
    const { uiTheme } = this.props;
    const { lightTransparentGreen, lightTransparentRed } = getColorsFromTheme(uiTheme);
    return record.type === 'buy' ? lightTransparentGreen : lightTransparentRed;
  }
}

export { TradeHistoryWidget };
export default connect(mapState, () => ({}))(TradeHistoryWidget);
