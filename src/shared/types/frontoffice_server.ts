// tslint:disable:interface-name
export interface MyExchangeBackOfficeAffiliateDetailResponse {
    order_date?: string; // date-time
    order_status?: 0 | 1 | 2 | 3;
    market?: string;
    amount?: number; // double
    commission?: number; // double
    affiliate_commission?: number; // double
}
export interface MyExchangeBackOfficePaginal {
    page?: number; // int32
    perPage?: number; // int32
}
export interface MyExchangeBackOfficePaging {
    page?: number; // int32
    per_page?: number; // int32
    total?: number; // int32
}
export interface MyExchangeBackOfficeReferalDetailsResponse {
    user_name?: string;
    affiliate_id?: string;
}
export interface MyExchangeBackOfficeReferalFilters {
    search?: string;
}
export interface MyExchangeBackOfficeReferalResponse {
    user_name?: string;
    email?: string;
    user_id?: string;
    affiliate_id?: string;
}
export interface MyExchangeDataSequence {
    value?: number; // int64
    namespace?: string; // byte
    counter?: number; // int64
}
export interface TradeioApiControllersAddressResponse {
    address?: string;
}
export interface TradeioApiControllersBasicAccountInfo {
    nickname?: string;
    email?: string;
    id?: string; // uuid
    affiliateId?: string;
}
export interface TradeioApiControllersConfirmEmailRequest {
    token?: string;
    email?: string;
}
export interface TradeioApiControllersCreateAccountRequest {
    account?: TradeioApiControllersCreateAccountRequestAccountInfo;
}
export interface TradeioApiControllersCreateAccountRequestAccountInfo {
    nickname?: string;
    email?: string;
    password?: string;
    referalId?: string;
}
export interface TradeioApiControllersCreateAccountResponse {
    account?: TradeioApiControllersBasicAccountInfo;
}
export interface TradeioApiControllersGetProfileResponse {
    account?: TradeioApiControllersGetProfileResponseAccountInfo;
    basicVerification?: TradeioApiDtoBasicVerificationDto;
}
export interface TradeioApiControllersGetProfileResponseAccountInfo {
    nickname?: string;
    email?: string;
}
export interface TradeioApiControllersLoginRequest {
    email?: string;
    password?: string;
    provider?: string;
    verificationCode?: string;
}
export interface TradeioApiControllersLoginResponse {
    message?: string;
    secondFactorRequired?: boolean;
    provider?: string;
    account?: TradeioApiControllersBasicAccountInfo;
}
export interface TradeioApiControllersOrderInfo {
    orderId?: number; // int64
    type?: string;
    amount?: number; // double
    price?: number; // double
    isLimit?: boolean;
    loanRate?: number; // double
    rateStop?: number; // double
    instrument?: string;
    createdAt?: string; // date-time
    unitsFilled?: number; // double
    isPending?: boolean;
}
export interface TradeioApiControllersOrderRequest {
    order?: TradeioApiControllersOrderRequestOrderInfo;
}
export interface TradeioApiControllersOrderRequestOrderInfo {
    type?: string;
    amount?: number; // double
    price?: number; // double
    isLimit?: boolean;
    loanRate?: number; // double
    rateStop?: number; // double
    instrument?: string;
    side?: 0 | 1;
}
export interface TradeioApiControllersOrderResponse {
    order?: TradeioApiControllersOrderInfo;
}
export interface TradeioApiControllersResendConfirmEmailRequest {
    email?: string;
}
export interface TradeioApiControllersResetPasswordRequest {
    email?: string;
}
export interface TradeioApiControllersToggle2FaRequest {
    code?: string;
    enable?: boolean;
}
export interface TradeioApiControllersTwoFactorAuthSecretResponse {
    secret?: string;
    otpUrl?: string;
    enabled?: boolean;
}
export interface TradeioApiControllersUpdateBasicVerificationRequest {
    account?: TradeioApiControllersUpdateBasicVerificationRequestAccountInfo;
}
export interface TradeioApiControllersUpdateBasicVerificationRequestAccountInfo {
    basicVerification?: TradeioApiDtoBasicVerificationDto;
}
export interface TradeioApiControllersUpdatePasswordRequest {
    account?: TradeioApiControllersUpdatePasswordRequestAccountInfo;
    resetPasswordToken?: string;
}
export interface TradeioApiControllersUpdatePasswordRequestAccountInfo {
    password?: string;
    email?: string;
}
export interface TradeioApiDtoBasicVerificationDto {
    inReview?: boolean;
    completed?: boolean;
    fullName?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    dateOfBirth?: string; // date-time
    personId?: string;
}
export interface TradeioApiResponseInfoResponse {
    serverTime?: number; // int64
    pairs?: {
        [name: string]: TradeioApiResponsePairInfo;
    };
}
export interface TradeioApiResponsePairInfo {
    decimalPlaces?: number; // int32
    minPrice?: number; // double
    maxPrice?: number; // double
    minAmount?: number; // double
    hidden?: number; // int32
    fee?: number; // double
    baseAsset?: string; // string
    quoteAsset?: string; // string
    makerFee?: number; // double
    makerFeeLimit?: number; // double
    takerFee?: number; // double
    takerFeeLimit?: number; // double
    withdrawalFee?: number; // double
    priceScale?: number; // int32
    amountScale?: number; // int32
    minTradeAmount?: number; // int32
    minOrderValue?: number; // int32
}
export interface TradeioApiResponsePairTicker {
    high?: number; // double
    low?: number; // double
    average?: number; // double
    volume?: number; // double
    volumeCurrency?: number; // double
    last?: number; // double
    buy?: number; // double
    sell?: number; // double
    updated?: MyExchangeDataSequence;
}
export interface TradeioApiResponsePairTrade {
    type?: string;
    price?: number; // double
    amount?: number; // double
    tradeId?: number; // int64
    timeStamp?: number; // int64
}
export interface TradeioApiResponseReferalInfoResponse {
    user_name?: string;
    affiliate_id?: string;
}
export interface TradeioApiServicesApiKeyFields {
    isInfo?: boolean;
    isTrade?: boolean;
    isWithdraw?: boolean;
    name?: string;
}
export interface TradeioApiServicesApiKeyInfo {
    publicKey?: string; // uuid
    privateKey?: string;
    userId?: string; // uuid
    isInfo?: boolean;
    isTrade?: boolean;
    isWithdraw?: boolean;
    name?: string;
}
