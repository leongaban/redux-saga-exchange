import { ISortInfo } from 'shared/types/ui';
import { IActiveOrderColumnData, IArchiveOrderColumnData } from 'shared/types/models';
import { IVersionedTypes } from 'shared/types/models/widgets/versioned/v4';

export const orderListVisibleColumns = {
  datePlaced: true,
  fullVolume: true,
  limitPrice: true,
  market: true,
  type: true,
  orderType: true,
  filledVolume: true,
  filledPercent: true,
  remainingVolume: false,
  remainingPercent: false,
};

export const orderListSortInfo: ISortInfo<IActiveOrderColumnData> = {
  column: 'datePlaced',
  direction: 'descend',
  kind: 'date',
};

export const orderListTableSettings: IVersionedTypes['IWidgetsSettingsAssoc']['order-list'] = {
  ...orderListVisibleColumns,
  sort: { ...orderListSortInfo },
  hideOtherPairs: false,
  shouldOpenCancelOrderModal: true,
};

export const orderHistorySortInfo: ISortInfo<IArchiveOrderColumnData> = {
  column: 'datePlaced',
  direction: 'descend',
  kind: 'date',
};

export const orderHistoryVisibleColumns = {
  datePlaced: true,
  fullVolume: true,
  limitPrice: true,
  market: true,
  filledVolume: true,
  filledPercent: true,
  remainingVolume: false,
  remainingPercent: false,
  type: true,
  orderType: true,
  total: true,
  fee: true,
  status: true,
};

export const orderHistoryTableSettings: IVersionedTypes['IWidgetsSettingsAssoc']['order-history'] = {
  ...orderHistoryVisibleColumns,
  sort: { ...orderHistorySortInfo },
  hideOtherPairs: false,
};

export const widgetSettings: IVersionedTypes['IWidgetsSettingsAssoc'] = {
  'balance': {
    currencyCodes: ['', ''],
  },
  'chart': {
    indicators: [],
    interval: 1,
    periodicity: 'h',
    isZoomEnabled: true,
    activeChartKind: 'candlesticks',
  },
  'chat': null,
  'exchange-rates': {
    currentMarketId: 'btc_usdt',
    sort: {
      column: 'market',
      direction: 'ascend',
      kind: 'simple',
    },
    changeAbsolute: false,
    changePercent: true,
    current: true,
  },
  'order-list': {
    ...orderListTableSettings,
  },
  'order-history': {
    ...orderHistoryTableSettings,
  },
  'order-book': {
    decimals: null,
    shouldOpenModalOnPlaceOrderRequest: true,
    widgetType: 'horizontal',
    displayedOrderType: 'All',
  },
  'trade-history': {
    sort: {
      column: 'date',
      direction: 'descend',
      kind: 'date',
    },
  },
  'place-order': { sidesDisplayMethod: 'both-sides' },
  'operation-history': {
    sort: {
      column: 'creationDate',
      direction: 'descend',
      kind: 'date',
    },
  },
};

export const presetWidgetsSettings: IVersionedTypes['WidgetsSettings'] = {
  'order-list': {
    6: widgetSettings['order-list'],
  },
  'exchange-rates': {
    5: widgetSettings['exchange-rates'],
  },
  'order-book': {
    8: widgetSettings['order-book'],
  },
  'order-history': {
    7: widgetSettings['order-history'],
  },
  'balance': {
    1: { currencyCodes: ['btc', 'usdt'] },
  },
  'chart': {
    3: {
      ...widgetSettings.chart,
    },
  },
  'chat': {},
  'trade-history': {
    9: widgetSettings['trade-history'],
  },
  'place-order': {
    10: widgetSettings['place-order'],
  },
  'operation-history': {
    11: widgetSettings['operation-history'],
  },
};
