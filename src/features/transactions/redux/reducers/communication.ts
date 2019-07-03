import { combineReducers } from 'redux';
import { makeCommunicationReducer } from 'shared/helpers/redux';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';

import { initial } from '../data/initial';

// tslint:disable:max-line-length
export const communicationReducer = combineReducers<NS.IReduxState['communication']>({
  loadTransactions: makeCommunicationReducer<NS.ILoadTransactions, NS.ILoadTransactionsSuccess, NS.ILoadTransactionsFail>(
    'TRANSACTIONS:LOAD_TRANSACTIONS',
    'TRANSACTIONS:LOAD_TRANSACTIONS_SUCCESS',
    'TRANSACTIONS:LOAD_TRANSACTIONS_FAIL',
    initial.communication.loadTransactions,
  ),
} as ReducersMap<NS.IReduxState['communication']>);
