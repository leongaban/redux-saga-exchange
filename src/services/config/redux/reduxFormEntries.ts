import { makeReduxFormEntry } from 'shared/helpers/redux';
import { IFilterForm } from '../namespace';

export const filterFormEntry =
  makeReduxFormEntry<IFilterForm>(
    'reportsFilterForm',
    ['baseCurrency', 'counterCurrency', 'fromDate', 'toDate', 'side', 'hideCancelled'],
  );
