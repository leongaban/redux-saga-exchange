import * as React from 'react';
import block from 'bem-cn';
import { bind } from 'decko';

import {
  IMTableColumn, IMTableRowSubcontent, IMTableRowSubcontentRow, ITablePaginationData, IMTableColumnWidth,
} from 'shared/types/ui';
import { Preloader } from 'shared/view/elements';
import PaginationControls from '../PaginationControls/PaginationControls';
import './MTable.scss';

type ID = string | number;

interface IProps<T> {
  columns: Array<IMTableColumn<T>>;
  records: T[];
  rowSubContent?: IMTableRowSubcontent<T>;
  paginationData?: ITablePaginationData;
  enableLiteVersion?: boolean;
  onRowClick?(x: T): void;
  getRecordID(x: T): ID;
}

const b = block('m-table');

interface IState {
  displayStatusesForRowsSubcontents: Record<string, boolean>;
}

class MTable<T> extends React.PureComponent<IProps<T>, IState> {

  public state: IState = {
    displayStatusesForRowsSubcontents: this.props.records.reduce((acc, x) => ({
      ...acc,
      [this.props.getRecordID(x)]: false,
    }), {})
  };

  public render() {
    const { columns, records, rowSubContent, enableLiteVersion, paginationData } = this.props;
    return (
      <div className={b({ 'holding-rows-with-subcontent': rowSubContent !== void 0, 'lite': !!enableLiteVersion })()}>
        {paginationData && paginationData.renderHeader(this.renderPaginationControls)}
        <div className={b('row', { header: true })()}>
          {columns.map(this.renderColumnHeader)}
        </div>
        <Preloader position="relative" isShow={Boolean(paginationData && paginationData.isRequesting)}>
          {records.map(this.renderRecord)}
        </Preloader>
      </div>
    );
  }

  @bind
  private renderColumnHeader({ getTitle, rightAligned, width }: IMTableColumn<T>, index: number) {
    return (
      <div
        className={b('cell', { 'column-header': true, 'right-aligned': !!rightAligned })()}
        style={this.getCellStyle(width)}
        key={index}
      >
        {getTitle()}
      </div >
    );
  }

  @bind
  private renderPaginationControls() {
    const { paginationData } = this.props;
    if (paginationData) {
      const { state, ...props } = paginationData;
      return <PaginationControls {...props} {...state} />;
    }

    console.warn('unexpected pagination data on renderPaginationControls', paginationData);
  }

  @bind
  private renderRecord(x: T) {
    const { columns, getRecordID, rowSubContent } = this.props;
    const { displayStatusesForRowsSubcontents } = this.state;
    const id = getRecordID(x);
    const shouldDisplayRowSubcontent = displayStatusesForRowsSubcontents[id];

    return (
      <div className={b('row')()} key={id} onClick={this.makeRowClickHandler(x)}>
        <div className={b('row-primary-content')()}>
          {columns.map(this.makeCellRenderer(x))}
          {rowSubContent && this.renderRowSubcontentCheckbox(id, shouldDisplayRowSubcontent)}
        </div>
        <div className={b('row-subcontent', { displayed: shouldDisplayRowSubcontent })()}>
          {rowSubContent && shouldDisplayRowSubcontent && this.renderRowSubcontent(rowSubContent, x)}
        </div>
      </div>
    );
  }

  private renderRowSubcontentCheckbox(recordID: ID, checked: boolean) {
    return (
      <div
        className={b('row-subcontent-checkbox-wrapper')()}
        onClick={this.makeRowSubcontentCheckboxClickHandler(recordID)}
      >
        <div className={b('row-subcontent-checkbox', { checked })()} />
      </div>
    );
  }

  @bind
  private makeRowSubcontentCheckboxClickHandler(recordID: ID) {
    return () => this.setState((prevState) => ({
      displayStatusesForRowsSubcontents: {
        ...prevState.displayStatusesForRowsSubcontents,
        [recordID]: !prevState.displayStatusesForRowsSubcontents[recordID],
      },
    }));
  }

  private renderRowSubcontent({ rows, renderBottomPart }: IMTableRowSubcontent<T>, record: T) {
    const flexible = this.props.columns[0].width === void 0;

    return (
      <>
        <div className={b('row-subcontent-rows', { flexible })()}>
          {rows.map(this.makeRowSubcontentRowRenderer(record))}
        </div>
        {renderBottomPart &&
          <div
            className={b('row-subcontent-bottom-part', { flexible })()}
          >
            {renderBottomPart(record)}
          </div>
        }
      </>
    );
  }

  private makeRowSubcontentRowRenderer(record: T) {
    return ({ getTitle, renderValue }: IMTableRowSubcontentRow<T>) => {

      return (
        <div className={b('row-subcontent-row')()} key={getTitle()}>
          <div
            className={b('row-subcontent-row-title')()}
            style={this.getCellStyle(this.props.columns[0].width)}
          >
            {getTitle()}
          </div>
          <div
            className={b('row-subcontent-row-value')()}
            style={this.getCellStyle(this.props.columns[1].width)}
          >
            {renderValue(record)}
          </div>
        </div>
      );
    };
  }

  private makeCellRenderer(x: T) {
    return ({ renderCell, width, rightAligned }: IMTableColumn<T>, index: number) => {
      return (
        <div
          className={b('cell', { 'right-aligned': !!rightAligned })()}
          style={this.getCellStyle(width)}
          key={index}
        >
          {renderCell(x)}
        </div>
      );
    };
  }

  private getCellStyle(columnWidth?: IMTableColumnWidth): React.CSSProperties | undefined {
    if (columnWidth) {
      const { unit, value } = columnWidth;
      return { flex: `0 0 ${value}${unit}` };
    }
  }

  @bind
  private makeRowClickHandler(record: T) {
    return () => {
      const { onRowClick } = this.props;
      if (onRowClick) {
        onRowClick(record);
      }
    };
  }
}

export default MTable;
