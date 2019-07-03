import {
  IServerTradeOrder, IServerOrderBookDiff, ITradeOrder,
  IOrderBookInfo
} from 'shared/types/models';

export function convertTradeOrder({ amount, price }: IServerTradeOrder): ITradeOrder {
  return {
    price,
    volume: amount,
    total: price * amount,
  };
}

export function convertOrderBookDiff(response: IServerOrderBookDiff): IOrderBookInfo {
  return {
    ask: response.asks.map(convertTradeOrder),
    bid: response.bids.map(convertTradeOrder),
    askTotalAmount: response.askTotalAmount,
    bidTotalAmount: response.bidTotalAmount,
  };
}
