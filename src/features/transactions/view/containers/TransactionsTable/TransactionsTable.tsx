import React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { bind } from 'decko';
import { bindActionCreators, Dispatch } from 'redux';
import { getFormValues } from 'redux-form';

import { IAppReduxState } from 'shared/types/app';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { Table } from 'shared/view/components';
import {
  IUserTransactionsTableColumns,
  ITransaction,
  IPaginatedData,
  TransactionType,
} from 'shared/types/models';
import { ISortInfo } from 'shared/types/ui';
import moment from 'services/moment';
import { defaultRecordsPerPageSelectConfig } from 'shared/constants';
import { selectors as configSelectors } from 'services/config';

import { actions, selectors, transactionsFilterFormEntry } from '../../../redux';
import TransactionsFilterForm from '../../components/TransactionsFilterForm/TransactionsFilterForm';
import { ITransactionsFilterForm } from '../../../namespace';
import './TransactionsTable.scss';

interface IOwnProps {
  userID: string;
}

interface IStateProps {
  transactions: IPaginatedData<ITransaction[]>;
  isRequesting: boolean;
  assetsCodes: string[];
  filters: Partial<ITransactionsFilterForm>;
}

interface IActionProps {
  loadTransactions: typeof actions.loadTransactions;
  reset: typeof actions.reset;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    transactions: selectors.selectTransactions(state),
    isRequesting: selectors.selectLoadTransactions(state).isRequesting,
    assetsCodes: configSelectors.selectAssetsCodes(state),
    filters: getFormValues(transactionsFilterFormEntry.name)(state) as Partial<ITransactionsFilterForm>,
  };
}

function mapDispatch(dispatch: Dispatch<IAppReduxState>): IActionProps {
  return bindActionCreators(actions, dispatch);
}

type IProps = IStateProps & IActionProps & IOwnProps & ITranslateProps;

const sortInfo: ISortInfo<IUserTransactionsTableColumns> = {
  column: 'creationDate',
  direction: 'descend',
  kind: 'date',
};

const b = block('transactions-table');

class TransactionsTable extends React.PureComponent<IProps> {

  private columns: IUserTransactionsTableColumns = {
    creationDate: {
      title: () => this.props.translate('TRANSACTIONS:TABLE:CREATION-DATE-COLUMN'),
      renderCell: ({ creationDate }: ITransaction) => moment(creationDate).format('DD.MM.YYYY H:m'),
      isSortable: false,
    },
    assetId: {
      title: () => this.props.translate('TRANSACTIONS:TABLE:ASSET-ID-COLUMN'),
      isSortable: false,
    },
    amount: {
      title: () => this.props.translate('TRANSACTIONS:TABLE:AMOUNT-COLUMN'),
      isSortable: false,
      width: 10,
    },
    type: {
      title: () => this.props.translate('TRANSACTIONS:TABLE:TYPE-COLUMN'),
      renderCell: ({ type }: ITransaction) => TransactionType[type],
      isSortable: false,
    },
    comment: {
      title: () => this.props.translate('TRANSACTIONS:TABLE:COMMENT-COLUMN'),
      isSortable: false,
    },
    accountId: {
      title: () => this.props.translate('TRANSACTIONS:TABLE:ACCOUNT-ID-COLUMN'),
      isSortable: false,
    },
    id: {
      title: () => this.props.translate('TRANSACTIONS:TABLE:ID-COLUMN'),
      isSortable: false,
    },
    version: {
      title: () => this.props.translate('TRANSACTIONS:TABLE:VERSION-COLUMN'),
      isSortable: false,
    },
    uniqId: {
      title: () => this.props.translate('TRANSACTIONS:TABLE:UNIQ-ID-COLUMN'),
      renderCell: (record: ITransaction) => <span className={b('text-cell')()}>{record.uniqId}</span>,
      isSortable: false,
      width: 10,
    },
  };

  public componentDidMount() {
    const { transactions: { pagination: { page, perPage } } } = this.props;
    this.loadTransactions(page, perPage);
  }

  public componentWillUnmount() {
    this.props.reset();
  }

  public render() {
    const { transactions: { data, pagination }, isRequesting } = this.props;

    return (
      <Table<ITransaction, ITransaction, ''>
        columns={this.columns}
        records={data}
        minWidth={70}
        sortInfo={sortInfo}
        recordsPerPageSelectConfig={defaultRecordsPerPageSelectConfig}
        shouldShowNumericPaginationControls
        recordIDColumn="id"
        renderHeader={this.renderHeader}
        serverPaginationProps={{
          onPageRequest: this.handleOnPageRequest,
          isRequesting,
          totalPages: pagination.total,
          activePage: pagination.page,
        }}
      />
    );
  }

  @bind
  private renderHeader(renderPaginationControls: () => JSX.Element | null) {
    const { assetsCodes } = this.props;
    return (
      <div className={b('header')()}>
        <div className={b('header-row', { align: 'left' })()}>
          <TransactionsFilterForm assetsCodes={assetsCodes} onFormSubmit={this.handleFilterFormSubmit} />
        </div>
        <div className={b('header-row', { align: 'right' })()}>
          {renderPaginationControls()}
        </div>
      </div>
    );
  }

  @bind
  private handleOnPageRequest(page: number, perPage: number) {
    this.loadTransactions(page, perPage);
  }

  @bind
  private handleFilterFormSubmit() {
    const { transactions: { pagination: { perPage } } } = this.props;
    this.loadTransactions(1, perPage);
  }

  @bind
  private loadTransactions(page: number, perPage: number) {
    const { loadTransactions, userID, filters } = this.props;
    loadTransactions({ page, perPage, userID, filters });
  }
}

export default connect(mapState, mapDispatch)(i18nConnect(TransactionsTable));
