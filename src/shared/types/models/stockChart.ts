import {
  IBasicDataFeed,
} from 'shared/types/charting_library';
import { ICurrencyPair } from './markets';
import { Omit } from '../app';

export interface IChartItem {
  ts: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

export interface ITVChartCandle extends Omit<IChartItem, 'ts'> {
  time: number;
}

export interface IDepthHistory {
  asks: number[][];
  bids: number[][];
}

export interface IServerCandle {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  instrument: string;
  start: string;
  end: string;
}

export interface IDataFeed extends IBasicDataFeed {
  setCurrentCurrencyPair(currentCurrencyPair: ICurrencyPair): void;
}
