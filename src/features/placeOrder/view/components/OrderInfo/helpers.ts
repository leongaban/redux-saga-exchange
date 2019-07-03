import * as R from 'ramda';
import { ITradeOrder, ICurrencyPair } from 'shared/types/models';
import { PurchasedAssetVolume, FeeType } from '../../../namespace';

export function calculateOrderFee(feeType: FeeType, purchasedAssetVolume: number, currencyPair: ICurrencyPair) {
  const { takerFeeLimit, makerFeeLimit, takerFee, makerFee } = currencyPair;

  const currencyFee = feeType === 'taker' ? takerFee : makerFee;
  const feeLimit = feeType === 'taker' ? takerFeeLimit : makerFeeLimit;

  return R.max(feeLimit, purchasedAssetVolume * currencyFee);
}

export function getBuyFormPurchasedAssetVolume(
  takerOrders: ITradeOrder[], placedOrderVolume: number,
): PurchasedAssetVolume {
  if (takerOrders.length === 0) {
    // no taker orders = whole fee is maker
    return { taker: 0, maker: placedOrderVolume };
  } else {
    const takerOrdersVolume = R.sum(takerOrders.map(x => x.volume));
    return placedOrderVolume > takerOrdersVolume
      // current book orders are not enough and a new order entry will be added
      ? { taker: takerOrdersVolume, maker: placedOrderVolume - takerOrdersVolume }
      // current book orders are enough and a new order entry won't be added
      : { taker: placedOrderVolume, maker: 0 };
  }
}

export function getSellFormPurchasedAssetVolume(
  takerOrders: ITradeOrder[], placedOrderPrice: number, placedOrderVolume: number,
): PurchasedAssetVolume {
  const placedOrderTotal = placedOrderPrice * placedOrderVolume;
  if (takerOrders.length === 0) {
    // no taker orders = whole fee is maker
    return { taker: 0, maker: placedOrderTotal };
  } else {
    const takerOrdersTotal = R.sum(takerOrders.map(x => x.total));
    return placedOrderTotal > takerOrdersTotal
      // current book orders are not enough and a new order entry will be added
      ? { taker: takerOrdersTotal, maker: placedOrderTotal - takerOrdersTotal }
      // current book orders are enough and a new order entry won't be added
      : { taker: placedOrderTotal, maker: 0 };
  }
}
