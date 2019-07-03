import { TableColumns } from '../ui';

export interface IAbstractMarket {
  name: string;
  nominal: string;
  limit: string;
  makerFee: number;
  takerFee: number;
  priceScale: number;
  amountScale: number;
  minOrderValue: number;
  minTradeAmount: number;
}

export interface IMarket extends IAbstractMarket {
  id: string;
  hidden: boolean;
}

export interface IEditMarketInfo {
  id: string;
  baseFee?: number;
  quoteFee?: number;
  makerFee?: number;
  takerFee?: number;
  priceScale?: number;
  amountScale?: number;
  minOrderValue?: number;
  minTradeAmount?: number;
  hidden?: boolean;
}

export interface IAbstractCurrencyPair {
  baseCurrency: string;
  counterCurrency: string;
}

export interface ICurrencyPair extends IAbstractCurrencyPair {
  id: string;
  fee: number;
  makerFee: number;
  makerFeeLimit: number;
  takerFee: number;
  takerFeeLimit: number;
  hidden: number;
  maxPrice: number;
  minAmount: number;
  minPrice: number;
  priceScale: number;
  amountScale: number;
  minOrderValue: number;
  minTradeAmount: number;
}

export type OrderValueFormatter = (market: string, orderValue: number, fallbackScale?: number) => string;
export type CurrencyPairByIDGetter = (id: string) => ICurrencyPair | undefined;

export type IMarketsTableColumns = TableColumns<IAbstractMarket, IMarket>;
