import * as R from 'ramda';

import { ISortInfo, SortKind, SortDirection } from 'shared/types/ui';

type ValueGetter = (obj: any) => any;
type Comparator<T> = (a: T, b: T) => number;

const sortedValueGetters: { [k in SortKind]: (obj: any) => any } = {
  date: makeDateGetter,
  simple: R.prop,
};

const sortComparators: { [d in SortDirection]: <T>(f: ValueGetter) => Comparator<T> } = {
  ascend: R.ascend,
  descend: R.descend,
};

export function getSortComparator<T>({ column, direction, kind }: ISortInfo<T>): Comparator<T> {
  return sortComparators[direction](sortedValueGetters[kind](column));
}

export function sortArray<T>(records: T[], sortInfo: ISortInfo<T>): T[] {
  return R.sort(getSortComparator(sortInfo), records);
}

export function sortArrayOnMultipleColumns<T>(records: T[], sortInfos: Array<ISortInfo<T>>): T[] {
  return R.sortWith(sortInfos.map(getSortComparator), records);
}

export function makeDateGetter<T>(column: keyof T) {
  return (x: T) => new Date(x[column] as any).getTime();
}
