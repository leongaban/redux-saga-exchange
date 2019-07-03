import { makeReduxFormEntry } from 'shared/helpers/redux';
import { IExchangeRatesFormSettings } from 'shared/types/models';

export const exchangeRatesSettingsFormEntry = makeReduxFormEntry<IExchangeRatesFormSettings>(
  'exchangeRatesSettings', ['changeAbsolute', 'changePercent', 'current']);
