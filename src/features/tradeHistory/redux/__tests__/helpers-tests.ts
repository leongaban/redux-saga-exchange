import uuid from 'uuid';
import * as R from 'ramda';

import { ITrade, ISocketServerTrade } from 'shared/types/models';
import moment from 'services/moment';
import { makeDescendDateSortChecker } from 'shared/helpers/test';
import { applyTradesDiff, equalById } from '../helpers';

const trade: ITrade = {
  exchangeRate: 0.1,
  amount: 0.3,
  date: '2018-10-01T20:56:05.866796Z',
  id: uuid(),
  market: 'zrx_tiox',
  type: 'sell'
};

const socketServerTrade: ISocketServerTrade = {
  executionPrice: 0.2,
  amount: 0.4,
  tradeTime: '2018-10-01T20:57:05.866796Z',
  tradeId: uuid(),
  instrument: 'zrx_tiox',
  side: 2
};

describe('applyTradesDiff helper', () => {
  test('Apply new uniq (by id) trades', () => {
    expect(
      applyTradesDiff([{ ...socketServerTrade, tradeId: uuid() }], [{ ...trade, id: uuid() }])
    ).toHaveLength(2);
  });

  test('Apply not uniq (by id) trades', () => {
    const notUniqId = uuid();
    expect(
      applyTradesDiff([{ ...socketServerTrade, tradeId: notUniqId }], [{ ...trade, id: notUniqId }])
    ).toHaveLength(1);
  });

  test('Apply new empty trades to previous', () => {
    expect(applyTradesDiff([], [{ ...trade }])).toHaveLength(1);
  });

  test('Apply trades to empty previous', () => {
    expect(applyTradesDiff([{ ...socketServerTrade }], [])).toHaveLength(1);
  });

  test('Apply empty to empty', () => {
    expect(applyTradesDiff([], [])).toHaveLength(0);
  });

  test('Check equality by id', () => {
    expect(equalById({ ...trade }, { ...trade })).toBe(true);
  });

  test('Should be descend sorted by date', () => {
    const prevTrades: ITrade[] = R.range(0, 10).map(x => {
      return {
        ...trade,
        id: uuid(),
        date: moment(trade.date).add((Math.random() * 10).toFixed(0), 'd').toISOString(),
      };
    });
    const result = applyTradesDiff([], prevTrades);
    const descendDateSortChecker = makeDescendDateSortChecker<ITrade>('date');
    const isSortedCorrectly = result.every(descendDateSortChecker);
    expect(isSortedCorrectly).toBe(true);
  });

  test('Result should no more than 100 items length', () => {
    const serverTrades: ISocketServerTrade[] = R.range(0, 103).map(() => ({ ...socketServerTrade, tradeId: uuid() }));
    expect(applyTradesDiff(serverTrades, [])).toHaveLength(100);
  });
});
