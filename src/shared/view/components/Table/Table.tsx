import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';
import * as R from 'ramda';

import { IModelColumn, IExtraColumn, SortKind, ISortInfo, SortDirection, SortChangeHandler } from 'shared/types/ui';
import { Preloader } from 'shared/view/elements';
import { sortArray, sortArrayOnMultipleColumns } from 'shared/helpers/sort';

import { IRecordsPerPageSelectConfig } from './namespace';
import PaginationControls from './PaginationControls/PaginationControls';
import './Table.scss';

export interface IServerPaginationProps {
  isRequesting: boolean;
  totalPages: number;
  activePage?: number;
  onPageRequest(page: number, perPage: number): void;
}

enum IDColumn {
  FromIndex = 'FROM_INDEX',
}

interface IProps<ColumnData, NonColumnData, ExtraColumnKey extends string> {
  columns: Partial<Record<keyof ColumnData, IModelColumn<ColumnData>>>;
  extraColumns?: Record<ExtraColumnKey, IExtraColumn<ColumnData & NonColumnData>>;
  records: Array<ColumnData & NonColumnData>;
  selectedRecord?: ColumnData & NonColumnData;
  sortInfo?: ISortInfo<ColumnData>;
  onSortInfoChange?: SortChangeHandler<ColumnData>;
  minWidth?: number;
  recordsPerPageSelectConfig?: IRecordsPerPageSelectConfig;
  serverPaginationProps?: IServerPaginationProps;
  shouldShowNumericPaginationControls?: boolean;
  recordIDColumn: keyof (ColumnData & NonColumnData) | IDColumn;
  renderHeaderRow?(x: ColumnData & NonColumnData): JSX.Element;
  areRecordsEqual?(x: ColumnData & NonColumnData, y: ColumnData & NonColumnData): boolean;
  onRecordSelect?(x: ColumnData & NonColumnData): void;
  getRowColor?(x: ColumnData & NonColumnData): string;
  getRowHoverColor?(x: ColumnData & NonColumnData): string;
  getSelectedRowHoverColor?(x: ColumnData & NonColumnData): string;
  renderHeader?(renderPaginationControls: () => JSX.Element | null): JSX.Element;
}

interface IState<ColumnData, NonColumnData> {
  sortInfo?: ISortInfo<ColumnData>;
  records: Array<ColumnData & NonColumnData>;
  activePage: number;
  contentHeight: number | null;
  recordsPerPage?: number;
}

const b = block('table');

class Table<ColumnData, NonColumnData = {}, ExtraColumnKey extends string = ''>
  extends React.PureComponent<IProps<ColumnData, NonColumnData, ExtraColumnKey>, IState<ColumnData, NonColumnData>> {

  public state: IState<ColumnData, NonColumnData> = {
    sortInfo: this.props.sortInfo,
    records: this.props.sortInfo
      ? this.sortRecords(this.props.records, this.props.sortInfo)
      : this.props.records,
    activePage: 1,
    recordsPerPage: this.props.recordsPerPageSelectConfig && this.props.recordsPerPageSelectConfig.initialOption,
    contentHeight: null,
  };

  private paginationControlsRef: PaginationControls | null = null;
  private contentRef: HTMLDivElement | null = null;

  private get pagesNumber() {
    const { records, serverPaginationProps } = this.props;
    if (serverPaginationProps) {
      return serverPaginationProps.totalPages;
    }
    const { recordsPerPage } = this.state;
    if (recordsPerPage) {
      return Math.ceil(records.length / recordsPerPage);
    }

    return 1;
  }

  // TODO use get derived state from props
  public componentWillReceiveProps(nextProps: IProps<ColumnData, NonColumnData, ExtraColumnKey>) {
    const { sortInfo } = this.state;
    if (nextProps.serverPaginationProps) {
      this.setState(() => ({ records: nextProps.records, sortInfo: nextProps.sortInfo }));
    } else if (this.props.records !== nextProps.records) {
      if (sortInfo) {
        this.setState(() => ({ records: this.sortRecords(nextProps.records, sortInfo) }));
      } else {
        this.setState(() => ({ records: nextProps.records }));
      }
    }
  }

  public componentDidMount() {
    this.setState({ contentHeight: this.contentRef && this.contentRef.getBoundingClientRect().height });
  }

  public render() {
    const { renderHeaderRow, minWidth, renderHeader, serverPaginationProps } = this.props;
    const columnsKeys = this.columnsKeys as Array<keyof ColumnData & ExtraColumnKey>;
    const extraColumnsKeys = (this.extraColumnsKeys || []) as Array<keyof ColumnData & ExtraColumnKey>;
    const minWidthValue = minWidth ? `${minWidth}rem` : void 0;

    return (
      <div
        className={b()}
        onKeyDown={this.handleKeyDown}
        tabIndex={0}
      >
        {renderHeader && renderHeader(this.renderPaginationControls)}
        <div
          ref={this.initContentRef}
          className={b('content')()}
        >
          <div
            className={b('row', { header: true })()}
            style={{ minWidth: minWidthValue }}
          >
            {renderHeaderRow && <div className={b('row-header')()} />}
            {columnsKeys.concat(extraColumnsKeys).map(this.renderHeader)}
          </div>
          <Preloader position="relative" isShow={Boolean(serverPaginationProps && serverPaginationProps.isRequesting)}>
            {this.renderRows(minWidthValue)}
          </Preloader>
        </div >
      </div >
    );
  }

  private sortRecords(
    records: Array<ColumnData & NonColumnData>,
    sortInfo: ISortInfo<ColumnData>,
  ): Array<ColumnData & NonColumnData> {
    const { recordIDColumn } = this.props;
    if (recordIDColumn === IDColumn.FromIndex) {
      return sortArray<ColumnData & NonColumnData>(records, sortInfo);
    }
    return sortArrayOnMultipleColumns<ColumnData & NonColumnData>(records, [
      sortInfo,
      { column: recordIDColumn, direction: 'descend', kind: 'simple' },
    ]);
  }

  @bind
  private handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.ctrlKey || e.metaKey) {
      if (this.paginationControlsRef) {
        if (e.key === 'ArrowLeft') {
          this.paginationControlsRef.selectPrevPage();
        } else if (e.key === 'ArrowRight') {
          this.paginationControlsRef.selectNextPage();
        }
      }
    }
  }

  @bind
  private renderPaginationControls() {
    const { recordsPerPage } = this.state;
    const { recordsPerPageSelectConfig, shouldShowNumericPaginationControls, serverPaginationProps } = this.props;
    if (recordsPerPageSelectConfig && recordsPerPage) {
      return (
        <PaginationControls
          ref={this.initPaginationControls}
          activePage={this.activePage}
          pagesNumber={this.pagesNumber}
          recordsPerPage={recordsPerPage}
          recordsPerPageSelectOptions={recordsPerPageSelectConfig.options}
          shouldShowNumericControls={shouldShowNumericPaginationControls}
          isRequesting={serverPaginationProps && serverPaginationProps.isRequesting}
          onPageChange={this.handlePageChange}
          onRecordsPerPageSelect={this.handleRecordsPerPageSelect}
        />
      );
    } else {
      console.warn(
        'unexpected condition on pagination controls render recordsPerPageSelectConfig',
        recordsPerPageSelectConfig,
        'recordsPerPage',
        recordsPerPage,
      );
    }
    return null;
  }

  @bind
  private initPaginationControls(x: PaginationControls | null) {
    this.paginationControlsRef = x;
  }

  @bind
  private initContentRef(x: HTMLDivElement | null) {
    this.contentRef = x;
  }

  @bind
  private handleRecordsPerPageSelect(x: number) {
    this.setState(() => ({ recordsPerPage: x, activePage: 1 }), () => {
      const { serverPaginationProps } = this.props;
      if (serverPaginationProps) {
        serverPaginationProps.onPageRequest(1, x);
      }
    });

  }

  @bind
  private handlePageChange(page: number) {
    console.log('handlePageChange', page);
    this.setState(() => ({ activePage: page }), () => {
      const { serverPaginationProps } = this.props;
      const { recordsPerPage } = this.state;
      if (serverPaginationProps) {
        if (recordsPerPage) {
          serverPaginationProps.onPageRequest(page, recordsPerPage);
        } else {
          console.warn('unexpected records per page on page change', recordsPerPage);
        }
      }
    });
  }

  private renderRows(minWidth?: string) {
    const records = this.records;
    return (
      <div className={b('rows')()} style={{ minWidth }}>
        {records.length > 0 && records.map(this.renderRow)}
        {!records.length && this.renderEmptyRows()}
      </div>
    );
  }

  private renderEmptyRows() {
    const { contentHeight } = this.state;
    if (!contentHeight) {
      return;
    }
    const rowsCount = contentHeight / 20;
    return R.range(0, rowsCount).map((_, index) => (
      <div
        key={index}
        className={b('row')()}
      />
    ));
  }

  @bind
  private renderHeader(key: keyof ColumnData & ExtraColumnKey) {
    const { columns, extraColumns } = this.props;
    const allColumns = { ...columns as any, ...extraColumns as any };
    const { title, isSortable = true, width, sortKind = 'simple' } = allColumns[key];
    const style = width ? { flex: `0 0 ${width}rem` } : {};
    const columnSortDirection = this.getColumnSortDirection(key);

    return (
      <div
        key={key}
        className={b('header-cell')()}
        style={style}
        onClick={this.makeSortTableHandler(key, isSortable, sortKind)}
      >
        {isSortable &&
          <div className={b('header-cell-sort-arrow', { sorted: columnSortDirection })()} />}
        <div className={b('header-cell-title')()}>
          {title()}
        </div>
      </div>
    );
  }

  @bind
  private renderRow(record: ColumnData & NonColumnData, recordIndex: number) {
    const {
      extraColumns, selectedRecord, areRecordsEqual, onRecordSelect, renderHeaderRow, getRowColor,
      recordIDColumn, getRowHoverColor,
    } = this.props;

    const isSelectedRecord = selectedRecord && areRecordsEqual
      ? areRecordsEqual(record, selectedRecord)
      : false;
    const renderCell = this.makeCellRenderer(record, isSelectedRecord);
    const backgroundColor = getRowColor ? getRowColor(record) : '';

    const key = (() => {
      if (recordIDColumn === IDColumn.FromIndex) {
        return recordIndex;
      }

      const valueFromIDColumn = record[recordIDColumn];
      if (typeof valueFromIDColumn === 'string' || typeof valueFromIDColumn === 'number') {
        return valueFromIDColumn;
      }

      console.warn('unexpected value', valueFromIDColumn, 'from id column', recordIDColumn);
      return recordIndex;
    })();

    return (
      <div
        key={key}
        style={{ backgroundColor }}
        className={b('row', {
          animate: true,
          selected: isSelectedRecord,
          selectable: Boolean(onRecordSelect),
        })()}
        onClick={this.makeRowClickHandler(record)}
        onMouseEnter={getRowHoverColor && this.makeRowMouseenterHandler(record)}
        onMouseLeave={getRowHoverColor && this.makeRowMouseleaveHandler(record)}
      >
        {renderHeaderRow && <div className={b('row-header')()}>{renderHeaderRow(record)}</div>}
        {this.columnsKeys.map(renderCell)}
        {extraColumns
          && this.extraColumnsKeys
          && this.extraColumnsKeys.map(this.makeExtraCellRenderer(record, extraColumns, isSelectedRecord))}
      </div>
    );
  }

  @bind
  private makeRowMouseenterHandler(record: ColumnData & NonColumnData) {
    return (event: React.MouseEvent<HTMLDivElement>) => {
      const { getRowHoverColor, selectedRecord, areRecordsEqual, getSelectedRowHoverColor } = this.props;
      const isSelectedRecord = selectedRecord && areRecordsEqual
        ? areRecordsEqual(record, selectedRecord)
        : false;
      if (getRowHoverColor) {
        if (isSelectedRecord) {
          (event.currentTarget as HTMLElement).style.backgroundColor = getSelectedRowHoverColor
            ? getSelectedRowHoverColor(record)
            : getRowHoverColor(record);
        } else {
          (event.currentTarget as HTMLElement).style.backgroundColor = getRowHoverColor(record);
        }
      }
    };
  }

  @bind
  private makeRowMouseleaveHandler(record: ColumnData & NonColumnData) {
    return (event: React.MouseEvent<HTMLDivElement>) => {
      const { getRowColor } = this.props;
      (event.currentTarget as HTMLElement).style.backgroundColor = getRowColor ? getRowColor(record) : '';
    };
  }

  private makeCellRenderer(record: ColumnData & NonColumnData, isSelectedRecord: boolean) {
    const { columns } = this.props;

    return (key: keyof ColumnData, indexCell: number) => {

      const { width, renderCell } = columns[key]!;
      const style = width ? { flex: `0 0 ${width}rem` } : {};
      return (
        <div
          key={indexCell}
          className={b('cell')()}
          style={style}
        >
          {renderCell
            ? renderCell(record, isSelectedRecord)
            : record[key]
              ? record[key] as any
              : '\u2014'}
        </div>
      );
    };
  }

  private makeExtraCellRenderer(
    record: ColumnData & NonColumnData,
    extraColumns: Record<ExtraColumnKey, IExtraColumn<ColumnData & NonColumnData>>,
    isSelectedRecord: boolean,
  ) {
    return (key: ExtraColumnKey) => {
      const width = extraColumns[key].width;
      const style = width ? { flex: `0 0 ${width}rem` } : {};
      const renderCell = extraColumns[key].renderCell;
      return (
        <div
          key={key}
          className={b('cell')()}
          style={style}
        >
          {renderCell(record, isSelectedRecord)}
        </div>
      );
    };
  }

  @bind
  private makeRowClickHandler(record: ColumnData & NonColumnData) {
    const { onRecordSelect } = this.props;
    if (onRecordSelect) {
      return () => {
        onRecordSelect(record);
      };
    }
  }

  private getColumnSortDirection(column: keyof ColumnData & ExtraColumnKey) {
    const { sortInfo } = this.state;
    return sortInfo && sortInfo.column === column
      ? sortInfo.direction
      : false;
  }

  @bind
  private makeSortTableHandler(
    columnName: keyof ColumnData & ExtraColumnKey,
    isSortable: boolean,
    sortKind: SortKind,
  ) {

    const { onSortInfoChange, records, serverPaginationProps } = this.props;
    if (serverPaginationProps && onSortInfoChange) {
      return () => {
        onSortInfoChange({
          column: columnName,
          direction: this.getNextSortDirection(columnName),
          kind: sortKind,
        });
      };
    } else if (isSortable && !serverPaginationProps) {
      return () => {
        const newSortInfo: ISortInfo<ColumnData> = {
          column: columnName,
          direction: this.getNextSortDirection(columnName),
          kind: sortKind,
        };

        this.setState({
          sortInfo: newSortInfo,
          records: this.sortRecords(records, newSortInfo),
        }, () => {
          if (onSortInfoChange) {
            onSortInfoChange(newSortInfo);
          }
        });

      };
    }
  }

  private getNextSortDirection(columnName: keyof ColumnData & ExtraColumnKey): SortDirection {
    const { sortInfo } = this.state;
    if (sortInfo && sortInfo.column === columnName && sortInfo.direction === 'ascend') {
      return 'descend';
    }
    return 'ascend';
  }

  private get records() {
    const { serverPaginationProps } = this.props;
    const { recordsPerPage, records, activePage } = this.state;

    const displayedRecords = (() => {
      if (recordsPerPage) {
        if (serverPaginationProps) {
          if (serverPaginationProps.isRequesting) {
            return [];
          }
          return records;
        }
        const pageLastRecordIndex = activePage * recordsPerPage;
        return records.slice(pageLastRecordIndex - recordsPerPage, pageLastRecordIndex);
      }
      return records;
    })();

    return displayedRecords;
  }

  private get columnsKeys() {
    return Object.keys(this.props.columns) as Array<keyof ColumnData>;
  }

  private get extraColumnsKeys(): ExtraColumnKey[] {
    if (this.props.extraColumns) {
      return Object.keys(this.props.extraColumns) as ExtraColumnKey[];
    }
    return [];
  }

  private get activePage() {
    const { activePage } = this.state;
    const { serverPaginationProps } = this.props;
    if (serverPaginationProps) {
      return serverPaginationProps.activePage ? serverPaginationProps.activePage : activePage;
    }
    return activePage;
  }
}

export default Table;
export {
  IServerPaginationProps as ITableServerPaginationProps,
  IRecordsPerPageSelectConfig as ITableRecordsPerPageSelectConfig,
  IDColumn as TableIDColumn,
};
