import * as R from 'ramda';
import { IActiveOrder } from 'shared/types/models';

export function applyActiveOrdersDiff<T extends IActiveOrder>(curArr: T[], diffArr: T[]): T[] {
  if (curArr.length) {
    return diffArr.reduce((orders, diff) => {
      const matchIndex = orders.findIndex(cur => diff.id === cur.id);
      if (matchIndex !== -1) {
        return diff.isPending ? R.update(matchIndex, diff, orders) : R.remove(matchIndex, 1, orders);
      }
      return diff.isPending ? R.prepend(diff, orders) : orders;
    }, curArr);
  }
  return diffArr.filter(x => x.isPending);
}
