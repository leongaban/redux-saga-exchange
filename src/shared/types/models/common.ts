import { SortDirection } from '../ui';

export interface ICountry {
  id: string;
  name: string;
  kyc: string;
  code: string;
}

export interface IImageFile extends Blob {
  name: string;
  preview?: string;
}

export interface IVerifyInfo {
  code: string;
  token: string;
}

export type ChartPeriodUnit = 'minute' | 'hour' | 'day' | 'week' | 'month';

export interface IChartPeriod {
  unit: ChartPeriodUnit;
  value: number;
}

export interface IChartSettings {
  marketID: string;
  period: IChartPeriod;
  indicators: string[]; // TODO use more precise type;
}

export type OrderSide = 'sell' | 'buy';

export type OrderType = 'Market' | 'Limit' | 'Conditional';

export type TwoFAType = 'sms' | 'Email' | 'Authenticator';

export type Role = 'Admin' | 'User' | 'Support';

export interface IPaginatedData<T> {
  data: T;
  pagination: IPaging;
}

export interface ISortInfoRequest<ColumnsData> {
  direction: SortDirection;
  column: keyof ColumnsData;
}

export interface ISortRequest<ColumnsData> {
  sort: ISortInfoRequest<ColumnsData>;
}

export interface IPagedRequest {
  page: number;
  perPage: number;
}

export interface IPagedRequestWithUserID extends IPagedRequest {
  userID: string;
}

export interface IFilteredRequest<F> {
  filters: F;
}

export interface IServerPagedRequest {
  Page: number;
  PerPage: number;
}

export interface IServerPaging {
  page: number;
  per_page: number;
  total: number;
}

export interface IServerPagedResponse<T> {
  data: T;
  paging: IServerPaging;
}

export interface IServerPaging {
  page: number;
  per_page: number;
  total: number;
}

export interface IPaging {
  page: number;
  perPage: number;
  total: number;
}
