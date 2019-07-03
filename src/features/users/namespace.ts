import { ICommunication, IPlainAction, IAction, IPlainFailAction } from 'shared/types/redux';
import { ILoadUsersRequest, ILoadUserArchiveOrdersRequest, ILoadUserOpenOrdersRequest } from 'shared/types/requests';
import {
  IAdminPanelUser, ICountry, IUserRole, IDocuments, IActiveOrder,
  IArchiveOrder, IPaginatedData, UsersBalance, ICurrencyBalance,
} from 'shared/types/models';
import { TableColumns, ITablePaginationState } from 'shared/types/ui';

export interface IReduxState {
  communication: {
    loadUsersCommunication: ICommunication;
    resetKycDocumentCommunication: ICommunication;
    getUserDocumentsCommunication: ICommunication;
    updateProfile: ICommunication;
    loadUserRoles: ICommunication;
    activateUser: ICommunication;
    deactivateUser: ICommunication;
    verifyUser: ICommunication;
    unlockUser: ICommunication;
    confirmEmail: ICommunication;
    deleteUserClaim: ICommunication;
    loadOpenOrders: ICommunication;
    loadUserBalance: ICommunication;
    loadUserArchiveOrders: ICommunication;
  };
  data: {
    users: IAdminPanelUser[];
    userRoles: IUserRole[];
    usersBalance: UsersBalance;
    openOrders: IPaginatedData<IActiveOrder[]>;
    archiveOrders: IPaginatedData<IArchiveOrder[]>;
  };
  edit: {
    currentProfile: IAdminPanelUser | null;
    isUserProfilModaleShown: boolean;
    usersTableTotalPages: number;
  };
}

export interface IUsersForm {
  nickname: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  country: ICountry;
  role: IUserRole;
  isEmailConfirmed: boolean;
  twoFactorEnabled: boolean;
}

export interface ILoadUserBalanceSuccessPayload {
  userID: string;
  balance: ICurrencyBalance[];
}

export interface ILoadOpenOrdersSuccessPayload {
  userID: string;
  orders: IActiveOrder[];
  totalPages: number;
  activePage: number;
}

export interface IUserBalanceColumnData {
  code: string;
  name: string;
  value: number;
}

export type IUserBalanceColumns = TableColumns<IUserBalanceColumnData, ICurrencyBalance>;

export type ProfileTab = 'basic info' | 'kyc info' | 'balance' | 'transactions' | 'order history' | 'open orders';

export type ILoadUsers = IAction<'USERS:LOAD_USERS', ILoadUsersRequest>;
export type ILoadUsersCompleted = IAction<'USERS:LOAD_USERS_COMPLETED', IAdminPanelUser[]>;
export type ILoadUsersFailed = IPlainFailAction<'USERS:LOAD_USERS_FAILED'>;

export type IResetKycDocument = IAction<
  'USERS:RESET_KYC_DOCUMENT',
  { userId: string, documentId: string }
  >;
export type IResetKycDocumentCompleted = IAction<'USERS:RESET_KYC_DOCUMENT_COMPLETED', string>;
export type IResetKycDocumentFailed = IPlainFailAction<'USERS:RESET_KYC_DOCUMENT_FAILED'>;

export type IGetUserDocuments = IAction<'USERS:GET_USER_DOCUMENTS', string>;
export type IGetUserDocumentsCompleted = IAction<
  'USERS:GET_USER_DOCUMENTS_COMPLETED',
  { userId: string, documents: IDocuments }
  >;
export type IGetUserDocumentsFailed = IPlainFailAction<'USERS:GET_USER_DOCUMENTS_FAILED'>;

export type IUpdateUserProfile = IAction<'USERS:UPDATE_PROFILE', Partial<IAdminPanelUser>>;
export type IUpdateUserProfileCompleted = IAction<'USERS:UPDATE_PROFILE_COMPLETED',
  { id: string, user: Partial<IAdminPanelUser> }>;
export type IUpdateUserProfileFailed = IPlainFailAction<'USERS:UPDATE_PROFILE_FAILED', any>;

export type ISetCurrentUserProfile = IAction<'USERS:SET_CURRENT_USER_PROFILE', Partial<IAdminPanelUser>>;

export type ISetUserProfileModalState = IAction<'USERS:SET_USER_PROFILE_MODAL_STATE', boolean>;

export type ISetUsersTableTotalPages = IAction<'USERS:SET_USERS_TABLE_TOTAL_PAGES', number>;

export type ILoadUserRoles = IPlainAction<'USERS:LOAD_USER_ROLES'>;
export type ILoadUserRolesSuccess = IAction<'USERS:LOAD_USER_ROLES_SUCCESS', IUserRole[]>;
export type ILoadUserRolesFail = IPlainFailAction<'USERS:LOAD_USER_ROLES_FAIL'>;

export type IActivateUser = IAction<'USERS:ACTIVATE_USER', string>;
export type IActivateUserSuccess = IAction<'USERS:ACTIVATE_USER_SUCCESS', string>;
export type IActivateUserFail = IPlainFailAction<'USERS:ACTIVATE_USER_FAIL'>;

export type IDeactivateUser = IAction<'USERS:DEACTIVATE_USER', string>;
export type IDeactivateUserSuccess = IAction<'USERS:DEACTIVATE_USER_SUCCESS', string>;
export type IDeactivateUserFail = IPlainFailAction<'USERS:DEACTIVATE_USER_FAIL'>;

export type IVerifyUser = IAction<'USERS:VERIFY_USER', boolean>;
export type IVerifyUserSuccess = IPlainAction<'USERS:VERIFY_USER_SUCCESS'>;
export type IVerifyUserFail = IPlainFailAction<'USERS:VERIFY_USER_FAIL'>;

export type IUnlockUser = IAction<'USERS:UNLOCK_USER', string>;
export type IUnlockUserSuccess = IPlainAction<'USERS:UNLOCK_USER_SUCCESS'>;
export type IUnlockUserFail = IPlainFailAction<'USERS:UNLOCK_USER_FAIL'>;

export type IConfirmEmail = IAction<'USERS:CONFIRM_EMAIL', string>;
export type IConfirmEmailSuccess = IPlainAction<'USERS:CONFIRM_EMAIL_SUCCESS'>;
export type IConfirmEmailFail = IPlainFailAction<'USERS:CONFIRM_EMAIL_FAIL'>;

export type IDeleteUserClaim = IAction<'USERS:DELETE_USER_CLAIM', number>;
export type IDeleteUserClaimSuccess = IPlainAction<'USERS:DELETE_USER_CLAIM_SUCCESS'>;
export type IDeleteUserClaimFail = IPlainFailAction<'USERS:DELETE_USER_CLAIM_FAIL'>;

export type ILoadOpenOrders = IAction<'USERS:LOAD_OPEN_ORDERS', ILoadUserOpenOrdersRequest>;
export type ILoadOpenOrdersSuccess = IAction<'USERS:LOAD_OPEN_ORDERS_SUCCESS', IPaginatedData<IActiveOrder[]>>;
export type ILoadOpenOrdersFail = IPlainFailAction<'USERS:LOAD_OPEN_ORDERS_FAIL'>;

export type ISetOpenOrdersTable = IAction<'USERS:SET_OPEN_ORDERS_TABLE', Partial<ITablePaginationState>>;

export type ILoadUserBalance = IAction<'USERS:LOAD_USER_BALANCE', string>;
export type ILoadUserBalanceSuccess = IAction<'USERS:LOAD_USER_BALANCE_SUCCESS', ILoadUserBalanceSuccessPayload>;
export type ILoadUserBalanceFail = IPlainFailAction<'USERS:LOAD_USER_BALANCE_FAIL'>;

export type ILoadUserArchiveOrders = IAction<'USERS:LOAD_USER_ARCHIVE_ORDERS', ILoadUserArchiveOrdersRequest>;
export type ILoadUserArchiveOrdersCompleted = IAction<'USERS:LOAD_USER_ARCHIVE_ORDERS_COMPLETED',
  IPaginatedData<IArchiveOrder[]>>;
export type ILoadUserArchiveOrdersFailed = IPlainFailAction<'USERS:LOAD_USER_ARCHIVE_ORDERS_FAILED'>;

export type Action =
  ILoadUsers |
  ILoadUsersCompleted |
  ILoadUsersFailed |
  ISetCurrentUserProfile |
  ISetUserProfileModalState |
  IUpdateUserProfile |
  IUpdateUserProfileCompleted |
  IUpdateUserProfileFailed |
  IResetKycDocument |
  IResetKycDocumentCompleted |
  IResetKycDocumentFailed |
  IGetUserDocuments |
  IGetUserDocumentsCompleted |
  IGetUserDocumentsFailed |
  ISetUsersTableTotalPages |
  ILoadUserRoles |
  ILoadUserRolesSuccess |
  ILoadUserRolesFail |
  IActivateUser |
  IActivateUserSuccess |
  IActivateUserFail |
  IDeactivateUser |
  IDeactivateUserSuccess |
  IDeactivateUserFail |
  IUnlockUser | IUnlockUserSuccess | IUnlockUserFail |
  IConfirmEmail | IConfirmEmailSuccess | IConfirmEmailFail |
  IDeleteUserClaim | IDeleteUserClaimSuccess | IDeleteUserClaimFail |
  ILoadUserArchiveOrders | ILoadUserArchiveOrdersCompleted | ILoadUserArchiveOrdersFailed |
  IVerifyUser |
  IVerifyUserSuccess |
  IVerifyUserFail | ILoadOpenOrders | ILoadOpenOrdersFail | ILoadOpenOrdersSuccess | ILoadUserBalance
  | ILoadUserBalanceSuccess | ILoadUserBalanceFail;
