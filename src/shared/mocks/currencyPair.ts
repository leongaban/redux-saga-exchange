import { ICurrencyPair } from 'shared/types/models';

export const currencyPair: ICurrencyPair = {
  id: 'bch_eth',
  baseCurrency: 'bch',
  counterCurrency: 'eth',
  maxPrice: 0,
  minPrice: 0,
  minAmount: 0,
  hidden: 0,
  fee: 0,
  makerFee: 0,
  makerFeeLimit: 0,
  takerFee: 0.001,
  takerFeeLimit: 0,
  priceScale: 7,
  amountScale: 6,
  minOrderValue: 0.01,
  minTradeAmount: 0.001,
};
