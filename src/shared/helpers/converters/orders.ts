import { IActiveOrder, IArchiveOrder, IServerOrder, OrderTypeEnum, OrderType,
  IAbstractOrder } from 'shared/types/models';

export function convertAbstractOrder(response: IServerOrder, type: 'active' | 'archive'): IAbstractOrder {
  const { requestedAmount, unitsFilled, remainingAmount } = response;
  const filledPercent = requestedAmount !== 0 ? (unitsFilled / requestedAmount) * 100 : 0;
  const remainingPercent = requestedAmount !== 0 ? (remainingAmount / requestedAmount) * 100 : 0;
  const limitPrice = type === 'active' ? response.requestedPrice : response.price;
  return {
    market: response.instrument,
    id: response.orderId,
    fullVolume: response.requestedAmount,
    remainingVolume: remainingAmount,
    remainingPercent,
    filledVolume: response.unitsFilled || 0,
    filledPercent,
    limitPrice,
    datePlaced: response.createdAt,
    orderType: OrderTypeEnum[response.orderType] as OrderType,
    type: response.type,
    isPending: response.isPending,
  };
}

export function convertToActiveOrder(response: IServerOrder): IActiveOrder {
  return {
    ...convertAbstractOrder(response, 'active'),
  };
}

export function convertToArchiveOrder(response: IServerOrder): IArchiveOrder {
  return {
    ...convertAbstractOrder(response, 'archive'),
    total: Math.abs(response.total),
    fee: response.commission,
    status: response.status,
  };
}
