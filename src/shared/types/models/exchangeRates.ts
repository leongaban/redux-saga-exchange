import { TableColumns } from '../ui';

export interface IExchangeRateColumnData {
  market: string;
  current: number;
  changeAbsolute: number;
  changePercent: number;
}

export interface IExchangeRateNonColumnData {
  high: number;
  low: number;
  volume: number;
}

export interface IExchangeRatesVisibleColumns extends
  Record<Exclude<keyof IExchangeRateColumnData, 'market'>, boolean> { }

export type IExchangeRate = IExchangeRateColumnData & IExchangeRateNonColumnData;

export type IExchangeRateColumns = TableColumns<IExchangeRateColumnData, IExchangeRate>;

export interface IInstrumentInfo {
  instrument: string;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  start: string;
  end: string;
}

export const periodQuoteType = {
  Minute: 1,
  Hour: 2,
  Day: 3,
  Week: 4,
  Month: 5,
  Minute_5: 6,
  Minute_15: 7,
  Minute_30: 8,
  Hour_2: 9,
  Hour_4: 10,
  Hour_8: 11,
  Hour_12: 12,
  Day_3: 13,
};

export type ExchangeRatePeriod = keyof typeof periodQuoteType;
export interface IExchangeRateDict {
  [market: string]: IExchangeRate;
}
