import { IAction, IPlainAction } from 'shared/types/redux';
import { IExchangeRateDict } from 'shared/types/models';

export interface IReduxState {
  data: {
    exchangeRates: IExchangeRateDict,
  };
}

export type CurrencyConverter = (value: number | string) => string | null;

export type IReset = IPlainAction<'MINITICKER_DATA_SOURCE:RESET'>;
export type IApplyMiniTickerDiff = IAction<'MINITICKER_DATA_SOURCE:APPLY_MINITICKER_DIFF', IExchangeRateDict>;
export type ISubscribe = IAction<'MINITICKER_DATA_SOURCE:SUBSCRIBE', string>;
export type IUnsubscribe = IAction<'MINITICKER_DATA_SOURCE:UNSUBSCRIBE', string>;

export type Action = IApplyMiniTickerDiff | IReset;
