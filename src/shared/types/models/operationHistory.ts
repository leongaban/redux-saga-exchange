import { TableColumns } from '../ui';

export interface IOperationHistoryColumnData {
  type: OperationType;
  asset: string;
  amount: number;
  status: OperationStatus;
  creationDate: string;
  confirmations: number;
}

export interface IOperationHistoryNonColumnData {
  id: string;
  confirmationsRequired: number;
  transactionId: string;
  link: string;
}

export interface IOperation extends IOperationHistoryColumnData, IOperationHistoryNonColumnData { }

export type IOperationHistoryColumns = TableColumns<IOperationHistoryColumnData, IOperation>;

export type OperationType = 'withdrawal' | 'deposit';
export type OperationStatus = 'complete' | 'unknown' | 'pending' | 'fail' | 'awaiting-confirmation'
  | 'pending-cancellation' | 'canceled' | 'funds-locked';

export interface ITransfer {
  amount: number;
  asset: string;
  comment: string;
  type: OperationType;
  requestId: number;
  status: OperationStatus;
  transferId: string;
  version: number;
  date: string;
  data: {
    txId: string;
    success: boolean;
    confirmations: number;
    confirmationsRequired: number;
    blockNumber: number;
    paymentSystem: string;
    receiveAddress: string;
    link: string;
  };
}

export interface IFilterData {
  search: string;
  startDate: number;
  endDate: number;
}
