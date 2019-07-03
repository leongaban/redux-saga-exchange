import {
  IActiveOrderColumnData, IAbstractOrderColumnData, IArchiveOrderColumnData, IServerOrder,
} from 'shared/types/models';

const abstractOrderColumnsTitles: Record<keyof IAbstractOrderColumnData, string> = {
  market: 'Market',
  fullVolume: 'Amount',
  filledVolume: 'Filled',
  filledPercent: 'Filled %',
  remainingVolume: 'Unfilled',
  remainingPercent: 'Unfilled %',
  limitPrice: 'Price',
  type: 'Side',
  orderType: 'Order Type',
  datePlaced: 'Date Placed',
};

export const activeOrderColumnsTitles: Record<keyof IActiveOrderColumnData, string> = {
  ...abstractOrderColumnsTitles,
};

export const archiveOrderColumnsTitles: Record<keyof IArchiveOrderColumnData, string> = {
  ...abstractOrderColumnsTitles,
  total: 'Total',
  fee: 'Fee',
  status: 'Status',
};

export const archiveOrdersServerColumns: Partial<Record<keyof IArchiveOrderColumnData, keyof IServerOrder>> = {
  market: 'instrument',
  fullVolume: 'requestedAmount',
  remainingVolume: 'remainingAmount',
  filledVolume: 'unitsFilled',
  limitPrice: 'price',
  datePlaced: 'createdAt',
  orderType: 'orderType',
  type: 'type',
  total: 'total',
  fee: 'commission',
  status: 'status',
};
