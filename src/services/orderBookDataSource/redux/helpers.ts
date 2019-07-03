import * as R from 'ramda';

import { ITradeOrder } from 'shared/types/models';

function applyOrdersDiff(curArr: ITradeOrder[], diffArr: ITradeOrder[]): ITradeOrder[] {
  if (curArr.length) {
    return diffArr.reduce((orders, diff) => {
      const matchIndex = orders.findIndex(cur => diff.price === cur.price);
      return matchIndex !== -1 ? R.update(matchIndex, diff, orders) : R.append(diff, orders);
    }, curArr);
  } else {
    return diffArr;
  }
}

const rejectZeroVolume: (xs: ITradeOrder[]) => ITradeOrder[] = R.reject((x: ITradeOrder) => x.volume === 0);

function applyOrderBookDiff(curArr: ITradeOrder[], diffArr: ITradeOrder[]): ITradeOrder[] {
  return R.pipe(
    applyOrdersDiff,
    rejectZeroVolume,
  )(curArr, diffArr);
}

export function applyBidDiff(curArr: ITradeOrder[], diffArr: ITradeOrder[]): ITradeOrder[] {
  return R.pipe(
    applyOrderBookDiff,
    R.sort(R.descend(R.prop('price'))),
  )(curArr, diffArr);
}

export function applyAskDiff(curArr: ITradeOrder[], diffArr: ITradeOrder[]): ITradeOrder[] {
  return R.pipe(
    applyOrderBookDiff,
    R.sort(R.ascend(R.prop('price'))),
  )(curArr, diffArr);
}
