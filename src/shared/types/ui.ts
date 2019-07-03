import { IQueryParams } from './app';

export interface IClosable {
  isOpen: boolean;
}

export interface ITab<T = string> {
  title: string;
  key: T;
  active: boolean;
  disabled?: boolean;
  hidden?: boolean;
  onClick(): void;
}

export interface IAbstractColumn {
  width?: number;
  isSortable?: boolean;
  sortKind?: 'simple' | 'date';
  title(): string;
}

export interface IHoldingCellRenderer<T> {
  renderCell(value: T, isSelectedRow: boolean): JSX.Element | string;
}

export interface IModelColumn<T> extends IAbstractColumn, Partial<IHoldingCellRenderer<T>> { }
export interface IExtraColumn<T> extends IAbstractColumn, IHoldingCellRenderer<T> { }

export interface IMTableColumnWidth {
  unit: '%' | 'rem';
  value: number;
}

export interface IMTableColumn<T> {
  rightAligned?: boolean;
  width?: IMTableColumnWidth;
  getTitle(): string | JSX.Element;
  renderCell(value: T): JSX.Element | string;
}

export interface IMTableRowSubcontent<T> {
  rows: Array<IMTableRowSubcontentRow<T>>;
  renderBottomPart?(value: T): JSX.Element | string;
}

export interface IMTableRowSubcontentRow<T> {
  getTitle(): string;
  renderValue(value: T): JSX.Element | string | number | null;
}

export type TableColumns<ColumnData, Model> = Record<keyof ColumnData, IModelColumn<Model>>;

export type NotificationKind = 'error' | 'info';

export interface INotification {
  kind: NotificationKind;
  text: string;
}

export type SortKind = 'simple' | 'date';

export type SortDirection = 'ascend' | 'descend';

export interface ISortInfo<T> {
  column: keyof T;
  kind: SortKind;
  direction: SortDirection;
}

export interface IHoldingSortInfo<T> {
  // TODO sort is a bad name
  sort: ISortInfo<T>;
}

export type SortChangeHandler<T> = (newSort: ISortInfo<T>) => void;

export type UITheme = 'day' | 'night' | 'moon';

export type RadioColorsSet = 'primary' | 'sell' | 'buy';

export type ClientDeviceType = 'desktop' | 'mobile';

// TODO move such state of desktop tables to redux
export interface ITablePaginationState {
  recordsPerPage: number;
  activePage: number;
}

export interface ITablePaginationData {
  state: ITablePaginationState;
  pagesNumber: number;
  recordsPerPageSelectOptions?: number[];
  isRequesting?: boolean;
  onPageChange(page: number): void;
  onRecordsPerPageSelect(recordsPerPage: number): void;
  renderHeader(renderPaginationControls: () => JSX.Element | null | undefined): JSX.Element;
}

export interface ISwitchableMobileContentProps<T> {
  queryParams: IQueryParams;
  onTabSwitch(tab: T): void;
}
