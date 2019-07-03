import * as React from 'react';
import block from 'bem-cn';
import * as R from 'ramda';
import { bind } from 'decko';

import { defaultTableRecordsPerPageSelectOptions } from 'shared/constants';
import { Select } from 'shared/view/elements';

import './PaginationControls.scss';

interface IProps {
  recordsPerPageSelectOptions?: number[];
  recordsPerPage: number;
  pagesNumber: number;
  activePage: number;
  shouldShowNumericControls?: boolean;
  isRequesting?: boolean;
  onPageChange(page: number): void;
  onRecordsPerPageSelect(recordsPerPage: number): void;
}

const b = block('table-pagination-controls');

class PaginationControls extends React.PureComponent<IProps> {
  public selectNextPage = this.makePageStepper(1);
  public selectPrevPage = this.makePageStepper(-1);

  private paginationNumericControlsNodes: Array<HTMLButtonElement | null> = [];

  public componentDidUpdate(prevProps: IProps) {
    if (this.props.activePage !== prevProps.activePage) {
      const pageControl = this.paginationNumericControlsNodes[this.props.activePage];
      if (pageControl) {
        pageControl.focus();
      } else {
        console.warn('no page control to focus');
      }
    }
  }

  public render() {
    const {
      recordsPerPageSelectOptions = defaultTableRecordsPerPageSelectOptions, recordsPerPage,
      onRecordsPerPageSelect, activePage, shouldShowNumericControls, pagesNumber, isRequesting,
    } = this.props;

    const isSimpleStepper = !shouldShowNumericControls;
    const isRequestingForSimpleStepper = isSimpleStepper && isRequesting;
    const isPrevPaginationControlDisabled = isRequestingForSimpleStepper || activePage === 1;
    const isNextPaginationControlDisabled = isRequestingForSimpleStepper || activePage === pagesNumber;

    return (
      <div className={b()}>
        <div className={b('records-per-page-select')()}>
          <Select
            options={recordsPerPageSelectOptions}
            selectedOption={recordsPerPage}
            onSelect={onRecordsPerPageSelect}
            optionValueKey={this.recordPerPageOptionValueKey}
          />
        </div>
        <div className={b('navigation-controls')()}>
          <button
            disabled={isPrevPaginationControlDisabled}
            className={b('prev-pagination-control')()}
            onClick={this.selectPrevPage}
            title="Ctrl ← / ⌥ ←"
          />
          {shouldShowNumericControls && this.renderNumericPaginationContols()}
          <button
            disabled={isNextPaginationControlDisabled}
            title="Ctrl → / ⌥ →"
            className={b('next-pagination-control')()}
            onClick={this.selectNextPage}
          />
        </div>
      </div>
    );
  }

  private renderNumericPaginationContols() {
    const { pagesNumber, activePage } = this.props;

    if (pagesNumber <= 9) {
      return R.range(1, pagesNumber + 1).map(this.renderNumericPaginationControl);
    }

    if (activePage <= 5) {
      return (
        <React.Fragment>
          {R.range(1, 8).map(this.renderNumericPaginationControl)}
          {this.renderDots()}
          {this.renderNumericPaginationControl(pagesNumber)}
        </React.Fragment>
      );
    }
    if (activePage >= pagesNumber - 4) {
      return (
        <React.Fragment>
          {this.renderNumericPaginationControl(1)}
          {this.renderDots()}
          {R.range(pagesNumber - 6, pagesNumber + 1).map(this.renderNumericPaginationControl)}
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        {this.renderNumericPaginationControl(1)}
        {this.renderDots()}
        {R.range(activePage - 2, activePage + 3).map(this.renderNumericPaginationControl)}
        {this.renderDots()}
        {this.renderNumericPaginationControl(pagesNumber)}
      </React.Fragment>
    );
  }

  private renderDots() {
    return <span className={b('pagination-dots')()}>…</span>;
  }

  @bind
  private renderNumericPaginationControl(page: number) {
    const { activePage } = this.props;
    return (
      <button
        key={page}
        className={b('numeric-pagination-control', { active: page === activePage })()}
        onClick={this.makeNumericPaginationControlClickHandler(page)}
        ref={this.makeNumericPaginationControlInitializer(page)}
      >
        {page}
      </button>
    );
  }

  private recordPerPageOptionValueKey(x: number) {
    return `Show ${x.toString()}`;
  }

  private makeNumericPaginationControlInitializer(page: number) {
    return (x: HTMLButtonElement | null) => {
      this.paginationNumericControlsNodes[page] = x;
    };
  }

  private makePageStepper(step: 1 | -1) {
    return () => {
      const { activePage, pagesNumber, onPageChange } = this.props;
      const newCurrentPage = activePage + step;

      if (newCurrentPage >= 1 && newCurrentPage <= pagesNumber) {
        onPageChange(newCurrentPage);
      }
    };
  }

  private makeNumericPaginationControlClickHandler(page: number) {
    return () => {
      const { activePage, onPageChange } = this.props;
      if (activePage !== page) {
        onPageChange(page);
      }
    };
  }

}

export default PaginationControls;
