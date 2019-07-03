import * as React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';

import { IAppReduxState } from 'shared/types/app';
import { floorFloatToFixed } from 'shared/helpers/number';
import moment from 'services/moment';
import { MTable } from 'shared/view/components';
import { ITrade, ICurrencyPair } from 'shared/types/models';
import { IMTableColumn } from 'shared/types/ui';

import { TradeHistoryDataSource } from '../..';
import { selectors } from './../../../../redux';

import './MTradeHistory.scss';

interface IStateProps {
  trades: ITrade[];
}

interface IOwnProps {
  currentCurrencyPair: ICurrencyPair;
}

type IProps = IStateProps & IOwnProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    trades: selectors.selectTrades(state),
  };
}

const b = block('m-trade-history');

class MTradeHistory extends React.PureComponent<IProps> {

  private displayedTradesNumber = 10;

  private columns: Array<IMTableColumn<ITrade>> = [
    {
      getTitle: () => 'PRICE',
      renderCell: ({ exchangeRate, type }: ITrade) => {
        return (
          <span className={b('price', { type })()}>
            {floorFloatToFixed(exchangeRate, this.props.currentCurrencyPair.priceScale)}
          </span>
        );
      },
      width: { unit: '%', value: 45 },
    },
    {
      getTitle: () => 'AMOUNT',
      renderCell: ({ amount }: ITrade) => {
        return floorFloatToFixed(amount, this.props.currentCurrencyPair.amountScale);
      },
    },
    {
      getTitle: () => 'TIME',
      renderCell: (record: ITrade) => {
        return moment(record.date).format('HH:mm:ss.SSS');
      },
      rightAligned: true,
    },
  ];

  public render() {
    const { trades, currentCurrencyPair: { id } } = this.props;
    return (
      <div className={b()}>
        <div className={b('title')()}>
          Trade History
        </div>
        <div className={b('table')()}>
          <MTable
            records={trades.slice(0, this.displayedTradesNumber)}
            columns={this.columns}
            getRecordID={this.getTradeID}
            enableLiteVersion
          />
        </div>
        <TradeHistoryDataSource currentMarket={id} />
      </div>
    );
  }

  private getTradeID({ id }: ITrade) {
    return id;
  }
}

export { MTradeHistory };
export default connect(mapState, () => ({}))(MTradeHistory);
