import * as R from 'ramda';
import { orders, currencyPair as currencyPairMock } from 'shared/mocks';
import { ICurrencyPair } from 'shared/types/models';
import { calculateOrderFee, getBuyFormPurchasedAssetVolume, getSellFormPurchasedAssetVolume } from '../helpers';

function getCurrencyPairWithOptions(options: Partial<ICurrencyPair>) {
  return { ...currencyPairMock, ...options };
}

describe('Test OrderInfo component helpers', () => {
  describe('Test calculateOrderFee function', () => {
    const purchasedAssetVolume = 20;

    test('Should return purchased asset volume multiplied by fee if no feeLimit is provided', () => {
      const currencyPair = getCurrencyPairWithOptions({ takerFeeLimit: 0, takerFee: 1, makerFeeLimit: 0, makerFee: 1 });
      expect(calculateOrderFee('taker', purchasedAssetVolume, currencyPair)).toEqual(20);
      expect(calculateOrderFee('maker', purchasedAssetVolume, currencyPair)).toEqual(20);
    });

    test('Should return feeLimit if it is greater than purchased asset volume multiplied by fee', () => {
      const currencyPair = getCurrencyPairWithOptions({
        takerFeeLimit: 21, takerFee: 1, makerFeeLimit: 21, makerFee: 1,
      });
      expect(calculateOrderFee('taker', purchasedAssetVolume, currencyPair)).toEqual(21);
      expect(calculateOrderFee('maker', purchasedAssetVolume, currencyPair)).toEqual(21);
    });

    test('Should return purchased asset volume multiplied by fee if it is greater than feeLimit', () => {
      const currencyPair = getCurrencyPairWithOptions({
        takerFeeLimit: 19, takerFee: 1, makerFeeLimit: 19, makerFee: 1,
      });
      expect(calculateOrderFee('taker', purchasedAssetVolume, currencyPair)).toEqual(20);
      expect(calculateOrderFee('maker', purchasedAssetVolume, currencyPair)).toEqual(20);
    });
  });

  describe('Test getBuyFormPurchasedAssetVolume function', () => {
    test('Whole fee is a maker if no taker orders are provided', () => {
      expect(getBuyFormPurchasedAssetVolume([], 322)).toEqual({ taker: 0, maker: 322 });
    });
    test('Whole fee is a taker if the order can be completed with the current order book orders', () => {
      expect(getBuyFormPurchasedAssetVolume(orders.ask, 322)).toEqual({ taker: 322, maker: 0 });
    });
    test('Fee is taker/maker if the order cannot be completed with the current order book orders', () => {
      const takerOrders = orders.ask.splice(0, 2);
      const takerOrdersVolume = R.sum(takerOrders.map(x => x.volume));
      const makerOrderVolume = 15;
      const placedOrderVolume = takerOrdersVolume + makerOrderVolume;
      expect(getBuyFormPurchasedAssetVolume(takerOrders, placedOrderVolume))
        .toEqual({ taker: takerOrdersVolume, maker: makerOrderVolume });
    });
  });
  describe('Test getSellFormPurchasedAssetVolume function', () => {
    test('Whole fee is a maker if no taker orders are provided', () => {
      expect(getSellFormPurchasedAssetVolume([], 12, 2)).toEqual({ taker: 0, maker: 24 });
    });
    test('Whole fee is a taker if the order can be completed with the current order book orders', () => {
      expect(getSellFormPurchasedAssetVolume(orders.bid, 0.005, 3)).toEqual({ taker: 0.015, maker: 0 });
    });
    test('Fee is taker/maker if the order cannot be completed with the current order book orders', () => {
      const takerOrders = orders.bid.splice(0, 2);
      const placedOrderPrice = takerOrders[1].price;

      const takerOrdersVolume = R.sum(takerOrders.map(x => x.volume));
      const makerOrderVolume = 20;
      const placedOrderVolume = takerOrdersVolume + makerOrderVolume;

      const takerOrdersTotal = R.sum(takerOrders.map(x => x.total));
      const makerOrderTotal = (placedOrderPrice * placedOrderVolume) - takerOrdersTotal;

      expect(getSellFormPurchasedAssetVolume(takerOrders, placedOrderPrice, placedOrderVolume))
        .toEqual({ taker: takerOrdersTotal, maker: makerOrderTotal });
    });
  });
});
