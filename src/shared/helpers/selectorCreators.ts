import { createSelector } from 'reselect';

import { ITablePaginationData, ITablePaginationState } from '../types/ui';

export function createPaginatedRecordsSelector<T, S>(
  selectAllRecords: (state: S) => T[],
  selectPaginationData: (state: S) => ITablePaginationData,
): (state: S) => T[] {

  return createSelector(
    selectAllRecords,
    selectPaginationData,
    (allRecords, paginationData): T[] => {
      const { state: { activePage, recordsPerPage } } = paginationData;
      const pageLastRecordIndex = activePage * recordsPerPage;

      return allRecords.slice(pageLastRecordIndex - recordsPerPage, pageLastRecordIndex);
    }
  );
}

export function createPagesNumberSelector<T, S>(
  selectAllRecords: (state: S) => T[],
  selectPaginationState: (state: S) => ITablePaginationState,
): (state: S) => number {

  return createSelector(
    selectAllRecords,
    selectPaginationState,
    (allRecords, paginationState) => {
      return allRecords.length === 0 ? 1 : Math.ceil(allRecords.length / paginationState.recordsPerPage);
    }
  );
}
