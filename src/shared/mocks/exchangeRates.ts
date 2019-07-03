import * as R from 'ramda';
import { IInstrumentInfo, IExchangeRate } from 'shared/types/models';
/* tslint:disable:max-line-length */
export const exchangeRates: IExchangeRate[] = [
  { current: 1.192, changeAbsolute: -0.081, changePercent: -0.05, market: 'eurusdt', high: 0, low: 0, volume: 0 },
  { current: 153.94, changeAbsolute: 0.95, changePercent: 0.62, market: 'aapleth', high: 0, low: 0, volume: 0 },
  { current: 4194.85, changeAbsolute: +21.7, changePercent: 0.55, market: 'btcusdt', high: 0, low: 0, volume: 0 },
  { current: 277.90, changeAbsolute: 3.90, changePercent: 0.25, market: 'ethusdt', high: 0, low: 0, volume: 0 },
  { current: 1289.17, changeAbsolute: +1.45, changePercent: 0.12, market: 'xauusdt', high: 0, low: 0, volume: 0 },
  { current: 343.74, changeAbsolute: -3.49, changePercent: -1.01, market: 'oilbtc', high: 0, low: 0, volume: 0 },
  { current: 411.61, changeAbsolute: 0, changePercent: 0, market: 'xagusdt', high: 0, low: 0, volume: 0 },
  { current: 2505.75, changeAbsolute: -1.87, changePercent: -0.05, market: 's&p500eth', high: 0, low: 0, volume: 0 },
];

export const instruments = ['eur_usdt', 'aapl_eth', 'btc_usd', 'eth_usdt', 'xau_usdt', 'xag_usdt'];

export const instrumentInfo: IInstrumentInfo[] = (() => {
  return R.range(0, instruments.length).map((index) => {
    const randomNegative = Math.random() * 2 > 1 ? 1 : -1;
    return {
      instrument: instruments[index],
      close: Number((randomNegative * 10 * Math.random()).toFixed(4)),
      open: Number((randomNegative * 10 * Math.random()).toFixed(4)),
      high: Number((Math.random() * 10).toFixed(4)),
      low: Number((Math.random() * 10).toFixed(4)),
      volume: Number((Math.random() * 10).toFixed(4)),
      start: '2018-04-08T12:00:00',
      end: '2018-04-08T12:00:00',
    };
  });
})();
