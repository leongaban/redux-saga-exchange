import * as NS from '../../namespace';
import { makeCommunicationActionCreators } from 'shared/helpers/redux';

// tslint:disable:max-line-length
export const { execute: restoreSession, completed: restoreSessionCompleted, failed: restoreSessionFail } =
  makeCommunicationActionCreators<NS.IRestoreSession, NS.IRestoreSessionCompleted, NS.IRestoreSessionFail>(
    'USER:RESTORE_SESSION', 'USER:RESTORE_SESSION_COMPLETED', 'USER:RESTORE_SESSION_FAIL',
  );

export const { execute: loadBalances, completed: loadBalancesCompleted, failed: loadBalancesFailed } =
  makeCommunicationActionCreators<NS.ILoadBalances, NS.ILoadBalancesCompleted, NS.ILoadBalancesFailed>(
    'USER:LOAD_BALANCES', 'USER:LOAD_BALANCES_COMPLETED', 'USER:LOAD_BALANCES_FAILED',
  );

export const { execute: restoreAdminSession, completed: restoreAdminSessionSuccess, failed: restoreAdminSessionFail } =
  makeCommunicationActionCreators<NS.IRestoreAdminSession, NS.IRestoreAdminSessionSuccess, NS.IRestoreAdminSessionFail>(
    'USER:RESTORE_ADMIN_SESSION', 'USER:RESTORE_ADMIN_SESSION_SUCCESS', 'USER:RESTORE_ADMIN_SESSION_FAIL',
  );

export const { execute: getDocument, completed: getDocumentSuccess, failed: getDocumentFail } =
  makeCommunicationActionCreators<NS.IGetDocument, NS.IGetDocumentSuccess, NS.IGetDocumentFail>(
    'USER:GET_DOCUMENT', 'USER:GET_DOCUMENT_SUCCESS', 'USER:GET_DOCUMENT_FAIL',
  );

export const { execute: fetchDocuments, completed: fetchDocumentsSuccess, failed: fetchDocumentsFail } =
  makeCommunicationActionCreators<NS.IFetchDocuments, NS.IFetchDocumentsSuccess, NS.IFetchDocumentsFail>(
    'USER:FETCH_DOCUMENTS', 'USER:FETCH_DOCUMENTS_SUCCESS', 'USER:FETCH_DOCUMENTS_FAIL',
  );
