import qs from 'query-string';
import { IExtendedTrade, IExtendedTradeHistoryColumnData } from 'shared/types/models';
import { ILoadFilteredExtendedTradesRequest } from 'shared/types/requests/tradeHistory';
import { ITradeHistoryServerTrade } from '../types';
import { convertToServerMarketDataFilter } from './shared';

export function convertTradeHistoryServerResponse(data: ITradeHistoryServerTrade): IExtendedTrade {
  return {
    market: data.instrument.replace('_', '/').toUpperCase(),
    amount: data.amount,
    comission: data.commission,
    date: data.tradeTime,
    tradeSeq: data.tradeSeq,
    exchangeRate: data.executionPrice,
    type: data.side ? 'sell' : 'buy',
  };
}

const serverColumn: { [key in keyof IExtendedTradeHistoryColumnData]: string } = {
  amount: 'amount',
  comission: 'comission',
  exchangeRate: 'executionPrice',
  date: 'tradeTime',
  market: 'instrument',
  tradeSeq: 'tradeSeq',
};

export function makeTradeHistoryFilterGetRequest(data: ILoadFilteredExtendedTradesRequest): string {
  const { filter, sortDirection, sortColumn, page, perPage } = data;
  const filterData = (() => {
    if (filter) {
      return convertToServerMarketDataFilter(filter);
    }
  })();
  const AscOrder = (() => {
    if (sortDirection === 'ascend') {
      return [serverColumn[sortColumn]];
    }
  })();
  const DescOrder = (() => {
    if (sortDirection === 'descend') {
      return [serverColumn[sortColumn]];
    }
  })();
  return qs.stringify({
    ...filterData,
    AscOrder,
    DescOrder,
    Page: page,
    PerPage: perPage,
  },
  {arrayFormat: 'bracket'});
}
