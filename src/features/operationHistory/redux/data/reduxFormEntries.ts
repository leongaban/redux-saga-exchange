import { makeReduxFormEntry } from 'shared/helpers/redux';
import * as NS from '../../namespace';

const operationsFilterFields: Array<keyof NS.IFilterForm> =
  ['fromDate', 'toDate', 'search'];

export const operationsFilterFormEntry =
  makeReduxFormEntry<NS.IFilterForm>('operationsFilterForm', operationsFilterFields);
