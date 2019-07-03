// tslint:disable:interface-name
// tslint:disable:max-line-length
// tslint:disable:class-name
export interface Account {
    userInfo?: User;
    orders?: Order[];
    assetAccounts?: AssetAccount[];
    transfers?: Transfer[];
    id?: number; // int64
    externalId?: string; // uuid
    version?: number; // int64
    busVersion?: number; // int64
}
export interface AffiliateDetails {
    orderDate?: string; // date-time
    orderStatus?: 0 | 1 | 2 | 3;
    market?: string;
    amount?: number; // double
    commission?: number; // double
    affiliateCommission?: number; // double
}
export interface AffiliatedUser {
    userId?: string;
    email?: string;
    userName?: string;
    registrationDate?: string; // date-time
}
export interface Asset {
    assetAccounts?: AssetAccount[];
    id?: string;
    canDeposit?: boolean;
    canWithdrawal?: boolean;
}
export interface AssetAccount {
    asset?: Asset;
    account?: Account;
    accountId?: number; // int64
    assetId?: string;
    amount?: number; // double
    locked?: number; // double
    version?: number; // int64
    key?: AssetAccountKey;
}
export interface AssetAccountKey {
    id?: number; // int64
}
export interface Market {
    id?: string;
    baseAsset?: string;
    quoteAsset?: string;
    priceScale?: number; // int32
    maxPrice?: number; // double
    minPrice?: number; // double
    minAmount?: number; // double
    amountScale?: number; // int32
    hidden?: boolean;
    baseFee?: number; // double
    quoteFee?: number; // double
}
export interface Order {
    market?: Market;
    baseAsset?: Asset;
    quoteAsset?: Asset;
    account?: Account;
    id?: number; // int64
    accountId?: number; // int64
    side?: 0 | 1;
    status?: 0 | 1 | 2 | 3;
    requestedAmount?: number; // double
    requestedPrice?: number; // double
    remainingAmount?: number; // double
    marketId?: string;
    baseAssetId?: string;
    quoteAssetId?: string;
    version?: number; // int64
    timeStampCreated?: number; // int64
}
export interface Paging {
    page?: number; // int32
    per_page?: number; // int32
    total?: number; // int32
}
export interface PostTransferRequest {
    externalId?: string; // uuid
    transferId?: string;
    data?: string;
    accountId?: number; // int64
    assetId?: string;
    amount?: number; // double
    type?: 0 | 1 | 2;
    status?: 0 | 1 | 2 | 3;
    comment?: string;
}
export interface PutAssetRequest {
    canDeposit?: boolean;
    canWithdrawal?: boolean;
}
export interface ReferalUser {
    userName?: string;
    referalLink?: string;
    affiliatedUsers?: ResponseIEnumerableAffiliatedUser__;
}
export interface ResponseIEnumerableAffiliateDetails__ {
    data?: AffiliateDetails[];
    filters?: {
        [name: string]: string;
    };
    paging?: Paging;
}
export interface ResponseIEnumerableAffiliatedUser__ {
    data?: AffiliatedUser[];
    filters?: {
        [name: string]: string;
    };
    paging?: Paging;
}
export interface ResponseIEnumerableObject__ {
    data?: Array<{
    }>;
    filters?: {
        [name: string]: string;
    };
    paging?: Paging;
}
export interface ResponseIEnumerableUserItem__ {
    data?: UserItem[];
    filters?: {
        [name: string]: string;
    };
    paging?: Paging;
}
export interface ResponseUserCard_ {
    data?: UserCard;
    filters?: {
        [name: string]: string;
    };
    paging?: Paging;
}
export interface TransactionRecord {
    id?: number; // int64
    creationDate?: string; // date-time
    instrument?: string;
    side?: 0 | 1;
    category?: string;
    price?: string;
    amount?: string;
    fee?: string;
    percent?: number; // double
    total?: string;
}
export interface Transfer {
    id?: number; // int64
    accountId?: number; // int64
    assetId?: string;
    version?: number; // int64
    type?: 0 | 1 | 2;
    amount?: number; // double
    comment?: string;
    creationDate?: string; // date-time
}
export interface TransferRequest {
    id?: number; // int64
    accountId?: number; // int64
    assetId?: string;
    version?: number; // int64
    type?: 0 | 1 | 2;
    amount?: number; // double
    comment?: string;
    creationDate?: string; // date-time
    status?: 0 | 1 | 2 | 3;
    transferId?: string;
    data?: string;
}
export interface User {
    userId?: string;
    userName?: string;
    email?: string;
    emailConfirmed?: boolean;
    lockoutEnabled?: boolean;
    registrationDate?: string; // date-time
    accountId?: number; // int64
    verification?: number; // int32
    comment?: string;
    canDeposit?: boolean;
    canWithdrawal?: boolean;
    referalId?: string;
    affiliateId?: string;
    userLoginInfos?: UserLoginInfo[];
    account?: Account;
}
export interface UserCard {
    userId?: string;
    nickname?: string;
    email?: string;
    registrationDate?: string; // date-time
    verification?: number; // int32
    reason?: string;
    deposits?: Transfer[];
    withdrawals?: Transfer[];
    transactions?: TransactionRecord[];
    loginInfos?: UserLoginInfo[];
}
export interface UserItem {
    userId?: string;
    nickname?: string;
    email?: string;
    registrationDate?: string; // date-time
    verification?: number; // int32
    reason?: string;
    deposits?: {
        [name: string]: number; // double
    };
    withdrawals?: {
        [name: string]: number; // double
    };
    volumes?: {
        [name: string]: number; // double
    };
}
export interface UserLoginInfo {
    id?: number; // int32
    userId?: string;
    loginDate?: string; // date-time
    ip?: string;
    location?: string;
    device?: string;
    user?: User;
}
export interface UserRequest {
    user_name?: string;
    email?: string;
    password?: string;
    can_deposit?: boolean;
    can_withdrawal?: boolean;
    referal_id?: string;
}
export interface UserResponse {
    user_name?: string;
    email?: string;
    can_deposit?: boolean;
    can_withdrawal?: boolean;
    id?: string; // uuid
    affiliate_id?: string;
}
