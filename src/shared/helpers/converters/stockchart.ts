import moment from 'moment';
import { IChartItem, IServerCandle, ITVChartCandle } from '../../types/models';

function convertCandleDate(date: string) {
  return moment.utc(date).valueOf();
}

export function convertChartHistory(data: IServerCandle[]): IChartItem[] {
  return data.map(convertChartTick);
}

export function convertChartTick(tick: IServerCandle): IChartItem {
  return {
    open: tick.open,
    close: tick.close,
    high: tick.high,
    low: tick.low,
    volume: tick.volume,
    ts: convertCandleDate(tick.start),
  };
}

export function convertTVChartHistory(data: IServerCandle[]): ITVChartCandle[] {
  return data.map(convertTVChartTick);
}

export function convertTVChartTick(tick: IServerCandle): ITVChartCandle {
  return {
    open: tick.open,
    close: tick.close,
    high: tick.high,
    low: tick.low,
    volume: tick.volume,
    time: convertCandleDate(tick.start),
  };
}
