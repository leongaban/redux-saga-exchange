import { getDefaultSizes } from '../helpers/widgets';

import { IRawWidgetLayout, IWidgetLayout } from '../types/models';

export function getRowYsFromRowHeights(rowHeights: number[]) {
  return rowHeights
    .slice(0, -1)
    .reduce((rowYs, rowHeight, i) => {
      return [
        ...rowYs,
        rowYs[i] + rowHeight,
      ];
    }, [0]);
}

export function insertSizes(layout: IRawWidgetLayout): IWidgetLayout {
  return { ...getDefaultSizes(layout.kind), ...layout };
}
