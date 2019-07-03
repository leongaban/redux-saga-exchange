import { stockChartDefaultHistoryDepth } from 'shared/constants';
import { PeriodicityUnit } from 'shared/types/models';

export const numOfRequestedCandles = stockChartDefaultHistoryDepth * 1.5;

/* distance in days between dateTo & dateFrom for Content container
*  default max candles on screen: 75
*  therefore at least 75 minutes, or hours, or days needed
*  for 1 minute interval, 1 hour, or 1 day accordingly
*  distances are taken with that in mind */
interface IDateDistances {
  [key: string]: number;
}

export const dateDistances: IDateDistances = {
  m: 2,
  h: 40,
  d: 230,
  w: 550,
  M: 2400,
};

export const hourInterval = '24h';

interface IChartInterval {
  textualRepresentation: string;
  period: number;
  periodicityUnit: PeriodicityUnit;
}

export const intervalEntries: IChartInterval[] = [
  { textualRepresentation: '1 minute', period: 1, periodicityUnit: 'm' },
  { textualRepresentation: '5 minutes', period: 5, periodicityUnit: 'm' },
  { textualRepresentation: '15 minutes', period: 15, periodicityUnit: 'm' },
  { textualRepresentation: '30 minutes', period: 30, periodicityUnit: 'm' },
  { textualRepresentation: '1 hour', period: 1, periodicityUnit: 'h' },
  { textualRepresentation: '2 hours', period: 2, periodicityUnit: 'h' },
  { textualRepresentation: '4 hours', period: 4, periodicityUnit: 'h' },
  { textualRepresentation: '8 hours', period: 8, periodicityUnit: 'h' },
  { textualRepresentation: '12 hours', period: 12, periodicityUnit: 'h' },
  { textualRepresentation: '1 day', period: 1, periodicityUnit: 'd' },
  { textualRepresentation: '1 week', period: 1, periodicityUnit: 'w' },
  { textualRepresentation: '1 month', period: 1, periodicityUnit: 'M' },
];
