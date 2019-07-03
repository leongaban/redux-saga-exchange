
import { IInstrumentInfo, IExchangeRate, IExchangeRateDict } from 'shared/types/models';

export function convertRate(data: IInstrumentInfo): IExchangeRate {
  const change = data.close - data.open;
  const changePercent = data.open !== 0 ? (change / data.open) * 100 : 0;
  return {
    market: data.instrument,
    changeAbsolute: change,
    changePercent,
    current: data.close,
    high: data.high,
    low: data.low,
    volume: data.volume,
  };
}

export function convertExchangeRates(response: IInstrumentInfo[]): IExchangeRateDict {
  const convertedData = response.map(convertRate);
  return convertedData.reduce((prev, curr) => {
    return { ...prev, [curr.market]: curr };
  }, {} as IExchangeRateDict);
}
