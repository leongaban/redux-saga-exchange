import { TableColumns } from '../ui';
import { IPagedRequest, IFilteredRequest } from './common';

export type IUserTransactionsTableColumns = TableColumns<ITransaction, ITransaction>;

export interface ITransactionFilters {
  type: TransactionType;
  asset: string;
}

export interface ITransaction {
  accountId: number;
  amount: number;
  assetId: string;
  comment: string;
  creationDate: string;
  id: number;
  type: TransactionType;
  uniqId: string;
  version: number;
}

export enum TransactionType {
  Deposit = 0,
  Withdrawal = 1,
  Commission = 2,
}

export interface ILoadTransactionsRequest extends
  IPagedRequest,
  IFilteredRequest<Partial<ITransactionFilters>> {
  userID: string;
}
