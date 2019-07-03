import { Decimal } from 'decimal.js';

import { ITradeOrder, OrderSide } from 'shared/types/models';

import * as NS from './namespace';

function calculateMarketOrderVolume(arr: ITradeOrder[], balance: number, resultVolume: number): number {
  if (arr.length === 0) {
    return resultVolume;
  }
  const { price, volume } = arr[0];
  const total = price * volume;
  if (total > balance) {
    return price === 0 ? resultVolume : resultVolume + balance / price;
  }

  return calculateMarketOrderVolume(arr.slice(1), balance - total, resultVolume + volume);
}

export function calculateVolume({
  formType,
  balancePercentage,
  baseCurrencyBalance,
  counterCurrencyBalance,
  orderType,
  askOrders,
  price,
}: NS.ICalculateVolumeOptions) {
  const volumeValue = (() => {
    switch (formType) {
      case 'sell':
        const portionOfBaseBalance = Decimal.mul(baseCurrencyBalance, balancePercentage).div(100).toNumber();

        return balancePercentage > 0
          ? portionOfBaseBalance
          : 0;

      case 'buy':
        const portionOfCounterBalance = Decimal.mul(counterCurrencyBalance, balancePercentage).div(100).toNumber();
        const normalizedPrice = isNaN(Number(price)) ? 0 : Number(price);
        const buyVolume = orderType === 'Market'
          ? calculateMarketOrderVolume(askOrders, portionOfCounterBalance, 0)
          : normalizedPrice === 0 ? 0 : portionOfCounterBalance / normalizedPrice;
        return buyVolume;
    }
  })();

  return volumeValue;
}

export function calculateTotal(volume?: string, price?: string) {
  if (volume !== undefined && price !== undefined) {
    return +volume * +price;
  }
  return void 0;
}

export function shouldShowLimitOrderPriceWarning(price: number, currentMarketPrice: number, formType: OrderSide) {
  const diffProportion = (price - currentMarketPrice) / currentMarketPrice;
  switch (formType) {
    // 0.05 === 5 percent
    case 'buy':
      return diffProportion >= 0.05;
    case 'sell':
      return diffProportion <= -0.05;
    default:
      return false;
  }
}
