import { ITrade, IExtendedTrade, ISocketServerTrade, IEndpointServerTrade } from 'shared/types/models';

export function convertSocketTrade(data: ISocketServerTrade): ITrade {
  return {
    exchangeRate: data.executionPrice,
    amount: data.amount,
    date: data.tradeTime,
    id: data.tradeId,
    market: data.instrument,
    type: data.side === 1 ? 'sell' : 'buy',
  };
}

export function convertEndpointrade(data: IEndpointServerTrade): IExtendedTrade {
  return {
    exchangeRate: data.executionPrice,
    amount: data.amount,
    date: data.tradeTime,
    market: data.instrument,
    type: data.side,
    tradeSeq: data.tradeSeq,
    comission: data.comission,
  };
}
