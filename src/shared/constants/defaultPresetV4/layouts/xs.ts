import { IVersionedTypes } from 'shared/types/models/widgets/versioned/v4';
import { getDefaultSizes } from 'shared/helpers/widgets';

import { getRowYsFromRowHeights } from '../../helpers';

const rowHeights = [22, 28, getDefaultSizes('place-order').h, 16, 22, 22, 22, 22, 22, 22, 22];
const rowYs = getRowYsFromRowHeights(rowHeights);

const xs: Array<IVersionedTypes['IRawWidgetLayout']> = [
  {
    x: 0,
    y: rowYs[0],
    h: rowHeights[0],
    i: '5',
    kind: 'exchange-rates',
  },
  {
    x: 0,
    y: rowYs[1],
    h: rowHeights[1],
    i: '3',
    kind: 'chart',
  },
  {
    x: 0,
    y: rowYs[2],
    h: rowHeights[2],
    i: '10',
    kind: 'place-order',
  },
  {
    x: 24,
    y: rowYs[0],
    h: getDefaultSizes('balance').h,
    i: '1',
    kind: 'balance',
  },
  {
    x: 24,
    y: rowYs[0] + getDefaultSizes('balance').h,
    h: rowHeights[0] - getDefaultSizes('balance').h,
    i: '8',
    kind: 'order-book',
  },
  {
    x: 0,
    y: rowYs[3],
    h: rowHeights[3],
    i: '6',
    kind: 'order-list',
  },
  {
    x: 0,
    y: rowYs[4],
    h: rowHeights[4],
    i: '9',
    kind: 'trade-history',
  },
  {
    x: 0,
    y: rowYs[5],
    h: rowHeights[5],
    i: '7',
    kind: 'order-history',
  },
  {
    x: 0,
    y: rowYs[6],
    h: rowHeights[6],
    i: '11',
    kind: 'operation-history',
  },
];

export default xs;
