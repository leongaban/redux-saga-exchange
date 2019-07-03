import { makeCommunicationReducer } from 'shared/helpers/redux';
import { ReducersMap } from 'shared/types/redux';
import { combineReducers } from 'redux';

import initial from '../data/initial';

import * as NS from '../../namespace';

// tslint:disable:max-line-length
export default combineReducers<NS.IReduxState['communications']>({
  sessionRestoring: makeCommunicationReducer<NS.IRestoreSession, NS.IRestoreSessionCompleted, NS.IRestoreSessionFail>(
    'USER:RESTORE_SESSION',
    'USER:RESTORE_SESSION_COMPLETED',
    'USER:RESTORE_SESSION_FAIL',
    initial.communications.sessionRestoring,
  ),
  loadBalances: makeCommunicationReducer<NS.ILoadBalances, NS.ILoadBalancesCompleted, NS.ILoadBalancesFailed>(
    'USER:LOAD_BALANCES',
    'USER:LOAD_BALANCES_COMPLETED',
    'USER:LOAD_BALANCES_FAILED',
    initial.communications.loadBalances,
  ),
  restoreAdminSession: makeCommunicationReducer<NS.IRestoreAdminSession, NS.IRestoreAdminSessionSuccess, NS.IRestoreAdminSessionFail>(
    'USER:RESTORE_ADMIN_SESSION',
    'USER:RESTORE_ADMIN_SESSION_SUCCESS',
    'USER:RESTORE_ADMIN_SESSION_FAIL',
    initial.communications.restoreAdminSession,
  ),
  fetchDocuments: makeCommunicationReducer<NS.IFetchDocuments, NS.IFetchDocumentsSuccess, NS.IFetchDocumentsFail>(
    'USER:FETCH_DOCUMENTS',
    'USER:FETCH_DOCUMENTS_SUCCESS',
    'USER:FETCH_DOCUMENTS_FAIL',
    initial.communications.fetchDocuments,
  ),
  getDocument: makeCommunicationReducer<NS.IGetDocument, NS.IGetDocumentSuccess, NS.IGetDocumentFail>(
    'USER:GET_DOCUMENT',
    'USER:GET_DOCUMENT_SUCCESS',
    'USER:GET_DOCUMENT_FAIL',
    initial.communications.getDocument,
  ),
} as ReducersMap<NS.IReduxState['communications']>);
