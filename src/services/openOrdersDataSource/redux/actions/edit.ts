import * as NS from '../../namespace';

export function setReportArchiveTotalPages(x: number): NS.ISetReportArchiveTotalPages {
  return { type: 'OPEN_ORDERS_DATA_SOURCE:SET_REPORT_ARCHIVE_TOTAL_PAGES', payload: x };
}
