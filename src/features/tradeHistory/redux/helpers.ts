import * as R from 'ramda';

import { ITrade, ISocketServerTrade } from 'shared/types/models/tradeHistory';
import { convertSocketTrade } from 'shared/helpers/converters';
import { getSortComparator } from 'shared/helpers/sort';

export const equalById = R.eqBy(R.prop<keyof ITrade>('id'));

export function applyTradesDiff(
  serverTrades: ISocketServerTrade[],
  prevTrades: ITrade[],
): ITrade[] {
  const newTrades = serverTrades.map(convertSocketTrade);
  const data = R.unionWith<ITrade>(equalById, newTrades, prevTrades);
  const lastHundred = R.sort(
    getSortComparator<ITrade>({ column: 'date', kind: 'date', direction: 'descend' }),
    data,
  ).slice(0, 100);
  return lastHundred;
}
