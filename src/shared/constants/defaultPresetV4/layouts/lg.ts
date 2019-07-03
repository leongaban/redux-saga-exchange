import { IVersionedTypes } from 'shared/types/models/widgets/versioned/v4';
import { getDefaultSizes } from 'shared/helpers/widgets';

import { getRowYsFromRowHeights } from '../../helpers';

const rowHeights = [22, getDefaultSizes('place-order').h, 27, 16, 22];
const rowYs = getRowYsFromRowHeights(rowHeights);

const lg: Array<IVersionedTypes['IRawWidgetLayout']> = [
  {
    x: 72,
    y: rowYs[0],
    h: rowHeights[0],
    i: '5',
    kind: 'exchange-rates',
  },
  {
    x: 24,
    y: rowYs[0],
    h: rowHeights[0],
    i: '3',
    kind: 'chart',
  },
  {
    x: 24,
    y: rowYs[1],
    h: rowHeights[1],
    i: '10',
    kind: 'place-order',
  },
  {
    x: 72,
    y: rowYs[1],
    h: getDefaultSizes('balance').h,
    i: '1',
    kind: 'balance',
  },

  {
    x: 72,
    y: rowYs[1] + getDefaultSizes('balance').h,
    h: rowHeights[1] - getDefaultSizes('balance').h,
    i: '8',
    kind: 'order-book',
  },
  {
    x: 0,
    y: rowYs[2],
    h: rowHeights[2],
    i: '6',
    kind: 'order-list',
  },
  {
    x: 0,
    y: 0,
    h: rowHeights[0],
    i: '9',
    kind: 'trade-history',
  },
  {
    x: 0,
    y: rowYs[3],
    h: rowHeights[3],
    i: '7',
    kind: 'order-history',
  },
  {
    x: 0,
    y: rowYs[1],
    h: rowHeights[1],
    i: '11',
    kind: 'operation-history',
  },
];

export default lg;
