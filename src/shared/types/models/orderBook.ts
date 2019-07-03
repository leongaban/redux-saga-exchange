// server interfaces
export interface IServerTradeOrder {
  price: number;
  amount: number;
}

export interface IServerOrderBookDiff {
  instrument: string;
  askTotalAmount: number;
  bidTotalAmount: number;
  asks: IServerTradeOrder[];
  bids: IServerTradeOrder[];
}

// client interfaces

export interface ITradeOrder {
  volume: number;
  total: number;
  price: number;
}

export interface ITradeOrders {
  bid: ITradeOrder[];
  ask: ITradeOrder[];
}

export interface IOrderBookOrder extends ITradeOrder {
  isMine: boolean;
}

export interface IOrderBook {
  bid: IOrderBookOrder[];
  ask: IOrderBookOrder[];
}

export interface ILastPrice {
  value: number;
  change: 'increased' | 'decreased' | 'unchanged';
}

export interface IOrderBookInfo extends ITradeOrders {
  askTotalAmount: number;
  bidTotalAmount: number;
}

export type OrderBookWidgetType = 'vertical' | 'horizontal';
export type DisplayedOrderType = 'All' | 'Bid' | 'Ask';
