import { IUser, IBalanceDict, IKycDocument, IDocuments } from 'shared/types/models';
import { IPlainAction, ICommunication, IAction, IPlainFailAction } from 'shared/types/redux';
import { ACCOUNT } from 'shared/constants';

export interface IDocumentResponse {
  id: string;
  url?: string;
  isCompleted?: boolean;
}

export interface IReduxState {
  data: {
    isAuthorized: boolean;
    isAdminAuthorized: boolean;
    isVerified: boolean;
    user: IUser | null;
    balances: IBalanceDict;
  };
  communications: {
    sessionRestoring: ICommunication;
    restoreAdminSession: ICommunication;
    loadBalances: ICommunication;
    fetchDocuments: ICommunication;
    getDocument: ICommunication;
  };
}

export type IRestoreSession = IPlainAction<'USER:RESTORE_SESSION'>;
export type IRestoreSessionCompleted = IAction<'USER:RESTORE_SESSION_COMPLETED', IUser>;
export type IRestoreSessionFail = IPlainFailAction<'USER:RESTORE_SESSION_FAIL'>;

export type ILogout = IPlainAction<'USER:LOGOUT'>;
export type ILogin = IPlainAction<'USER:LOGIN'>;

export type IAdminLogin = IAction<'USER:ADMIN_LOGIN', IUser>;
export type IAdminLogout = IPlainAction<'USER:ADMIN_LOGOUT'>;

export type ILoadBalances = IPlainAction<'USER:LOAD_BALANCES'>;
export type ILoadBalancesCompleted = IAction<'USER:LOAD_BALANCES_COMPLETED', IBalanceDict>;
export type ILoadBalancesFailed = IPlainFailAction<'USER:LOAD_BALANCES_FAILED'>;

export type IApplyBalanceDiff = IAction<'USER:APPLY_BALANCE_DIFF', IBalanceDict>;

export type IRestoreAdminSession = IPlainAction<'USER:RESTORE_ADMIN_SESSION'>;
export type IRestoreAdminSessionSuccess = IAction<'USER:RESTORE_ADMIN_SESSION_SUCCESS', IUser>;
export type IRestoreAdminSessionFail = IPlainFailAction<'USER:RESTORE_ADMIN_SESSION_FAIL'>;

export type IUpdateData = IAction<'USER:UPDATE_DATA', Partial<IUser>>;

export type IGetDocument = IAction<'USER:GET_DOCUMENT', { documents: IKycDocument[], currType: ACCOUNT }>;
export type IGetDocumentSuccess = IAction<'USER:GET_DOCUMENT_SUCCESS', IDocumentResponse>;
export type IGetDocumentFail = IPlainFailAction<'USER:GET_DOCUMENT_FAIL'>;

export type IFetchDocuments = IAction<
  'USER:FETCH_DOCUMENTS',
  (kycDocuments: IKycDocument[], documents: IDocuments) => void
  >;
export type IFetchDocumentsSuccess = IPlainFailAction<'USER:FETCH_DOCUMENTS_SUCCESS'>;
export type IFetchDocumentsFail = IPlainFailAction<'USER:FETCH_DOCUMENTS_FAIL'>;

export type ISetDocumentComplete = IAction<'USER:SET_DOCUMENT_COMPLETE', string>;

export type IRemoveDocumentUrl = IAction<'USERS:REMOVE_DOCUMENT_URL', string>;

export type Action = IRestoreSession | IRestoreSessionCompleted | IRestoreSessionFail | ILogout | ILogin
  | ILoadBalances | ILoadBalancesCompleted | ILoadBalancesFailed | IUpdateData | IAdminLogin | IAdminLogout
  | IRestoreAdminSession | IRestoreAdminSessionSuccess | IRestoreAdminSessionFail
  | IGetDocument | IGetDocumentSuccess | IGetDocumentFail
  | IFetchDocuments | IFetchDocumentsSuccess | IFetchDocumentsFail
  | ISetDocumentComplete | IRemoveDocumentUrl | IApplyBalanceDiff;
