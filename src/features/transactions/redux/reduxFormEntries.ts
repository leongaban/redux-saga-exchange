import { makeReduxFormEntry } from 'shared/helpers/redux';
import * as NS from '../namespace';

export const transactionsFilterFormEntry = makeReduxFormEntry<NS.ITransactionsFilterForm>('transactions-filter-form',
  ['type', 'asset']);
