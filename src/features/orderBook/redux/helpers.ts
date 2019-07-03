import { Decimal } from 'decimal.js';

import { ITradeOrder, IActiveOrder, IOrderBookOrder } from 'shared/types/models';

export function makeDecimalGrouper(
  decimals: number, round: (x: number, decimals: number) => Decimal,
) {
  return function groupByDecimals(tradeOrders: ITradeOrder[], activeOrders: IActiveOrder[]): IOrderBookOrder[] {
    if (tradeOrders.length === 0) {
      return [];
    }

    const checkIfGroupHasMyOrder = (current: Decimal) => {
      return !!activeOrders.find(activeOrder => {
        return round(activeOrder.limitPrice, decimals).equals(current);
      });
    };

    let currentGroup = round(tradeOrders[0].price, decimals);
    let currentGroupVolume = tradeOrders[0].volume;
    let currentGroupTotal = tradeOrders[0].total;
    const acc: IOrderBookOrder[] = [];

    tradeOrders.slice(1).forEach(x => {
      const nextGroup = round(x.price, decimals);

      if (nextGroup.equals(currentGroup)) {
        currentGroupVolume += x.volume;
        currentGroupTotal += x.total;
      } else {
        acc.push({
          price: currentGroup.toNumber(),
          volume: currentGroupVolume,
          total: currentGroupTotal,
          isMine: checkIfGroupHasMyOrder(currentGroup),
        });
        currentGroup = nextGroup;
        currentGroupVolume = x.volume;
        currentGroupTotal = x.total;
      }
    });

    if (currentGroupVolume > 0) {
      acc.push({
        price: currentGroup.toNumber(),
        volume: currentGroupVolume,
        total: currentGroupTotal,
        isMine: checkIfGroupHasMyOrder(currentGroup),
      });
    }

    return acc;
  };
}
