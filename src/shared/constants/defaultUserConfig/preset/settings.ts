import { ISortInfo } from 'shared/types/ui';
import {
  IWidgetsSettingsAssoc, WidgetsSettings, IArchiveOrderColumnData, IOrderHistorySettings,
  IOrderListSettings, IActiveOrderColumnData, IOperationHistoryColumnData,
} from 'shared/types/models';

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

export const orderListTableSettings: IOrderListSettings = {
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

export const operationHistorySortInfo: ISortInfo<IOperationHistoryColumnData> = {
  column: 'creationDate',
  direction: 'descend',
  kind: 'date',
};

export const orderHistoryVisibleColumns: Record<keyof IArchiveOrderColumnData, boolean> = {
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

export const orderHistoryTableSettings: IOrderHistorySettings = {
  ...orderHistoryVisibleColumns,
  sort: { ...orderHistorySortInfo },
  hideOtherPairs: false,
};

export const widgetSettings: IWidgetsSettingsAssoc = {
  'balance': {
    currencyCodes: ['', ''],
  },
  'chart': {
    indicators: [],
    interval: 1,
    periodicity: 'h',
    isZoomEnabled: true,
    activeChartKind: 'candlesticks',
    barStyle: 'candle',
    candlesticksChartKind: 'stockchart-x',
    tvIndicators: [],
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
    depthView: false,
  },
  'trade-history': {
    sort: {
      column: 'date',
      direction: 'descend',
      kind: 'date',
    },
  },
  'place-order': {
    sidesDisplayMethod: 'both-sides',
  },
  'operation-history': {
    sort: operationHistorySortInfo,
  },
  'reporting': {
    activeReportingContentKind: 'order-list',
    hideOtherPairs: false,
    orderList: {
      ...orderListVisibleColumns,
      sort: orderListSortInfo,
      shouldOpenCancelOrderModal: true,
    },
    orderHistory: {
      ...orderHistoryVisibleColumns,
      sort: orderHistorySortInfo,
    },
    operationHistory: {
      sort: operationHistorySortInfo,
    }
  },
  'announcement-bar': null,
};

export const presetWidgetsSettings: WidgetsSettings = {
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
  'reporting': {},
  'announcement-bar': {},
};
