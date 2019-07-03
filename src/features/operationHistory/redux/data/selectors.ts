import { createSelector } from 'reselect';
import { getFormValues } from 'redux-form';

import moment from 'services/moment';
import { IAppReduxState } from 'shared/types/app';

import { operationsFilterFormEntry } from './reduxFormEntries';
import * as NS from '../../namespace';

export function getFeatureState(state: IAppReduxState): NS.IReduxState {
  return state.operationHistory;
}

export function selectFormValues(state: IAppReduxState): Partial<NS.IFilterForm> {
  return getFormValues(operationsFilterFormEntry.name)(state);
}

export const selectOperations = createSelector(
  (state: IAppReduxState) => getFeatureState(state).data.operations,
  selectFormValues,
  (operations, filterData) => {
    if (filterData) {
      let filteredOperations = [...operations];
      const { search, fromDate, toDate } = filterData;
      if (search) {
        filteredOperations = filteredOperations.filter((operation) => {
          return operation.asset.toLowerCase().includes(search.toLowerCase()) ||
            operation.type.includes(search.toLowerCase());
        });
      }
      if (fromDate) {
        filteredOperations = filteredOperations.filter(
          operation => +moment(operation.creationDate) >= +moment(fromDate),
        );
      }
      if (toDate) {
        filteredOperations = filteredOperations.filter(
          operation => +moment(operation.creationDate) <= +moment(toDate),
        );
      }
      return filteredOperations;
    }
    return operations;
  },
);
