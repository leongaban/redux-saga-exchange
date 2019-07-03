import { ICommunication, IAction, IPlainFailAction, IPlainAction } from 'shared/types/redux';
import { IPaginatedData, ITransaction, ITransactionFilters, ILoadTransactionsRequest } from 'shared/types/models';

export interface IReduxState {
  communication: {
    loadTransactions: ICommunication;
  };
  data: {
    transactions: IPaginatedData<ITransaction[]>;
  };
}

export type ITransactionsFilterForm = ITransactionFilters;

export type ILoadTransactions = IAction<'TRANSACTIONS:LOAD_TRANSACTIONS', ILoadTransactionsRequest>;
export type ILoadTransactionsSuccess = IAction<'TRANSACTIONS:LOAD_TRANSACTIONS_SUCCESS',
  IPaginatedData<ITransaction[]>>;
export type ILoadTransactionsFail = IPlainFailAction<'TRANSACTIONS:LOAD_TRANSACTIONS_FAIL'>;

export type IReset = IPlainAction<'TRANSACTIONS:RESET'>;

export type Action =
  ILoadTransactions | ILoadTransactionsSuccess | ILoadTransactionsFail;
