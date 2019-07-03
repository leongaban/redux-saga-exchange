import { IExchangeRatesVisibleColumns } from 'shared/types/models';

export const exchangeRatesColumnsTitles: Record<keyof IExchangeRatesVisibleColumns, string> = {
  changeAbsolute: 'Change',
  changePercent: 'Change %',
  current: 'Current',
};

export const counterCurrencies = {
  btc: 'btc',
  eth: 'eth',
  tiox: 'tiox',
  usds: 'usds',
  usdt: 'usdt',
  tusd: 'tusd',
};
