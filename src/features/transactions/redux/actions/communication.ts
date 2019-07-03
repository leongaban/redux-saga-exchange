import * as NS from '../../namespace';
import { makeCommunicationActionCreators } from 'shared/helpers/redux';

export const { execute: loadTransactions, completed: loadTransactionsSuccess, failed: loadTransactionsFail } =
  makeCommunicationActionCreators<NS.ILoadTransactions, NS.ILoadTransactionsSuccess, NS.ILoadTransactionsFail>(
    'TRANSACTIONS:LOAD_TRANSACTIONS', 'TRANSACTIONS:LOAD_TRANSACTIONS_SUCCESS', 'TRANSACTIONS:LOAD_TRANSACTIONS_FAIL',
  );
