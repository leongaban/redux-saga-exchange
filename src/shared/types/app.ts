import { ReactElement } from 'react';
import { RouteProps } from 'react-router';
import { History } from 'history';
import { Store, Reducer, ActionCreator, Action } from 'redux';
import { SagaIterator } from 'redux-saga';

import * as features from 'features';
import { IMultiInstanceState } from 'shared/helpers/redux/multiConnect';
import { namespace as ProtectorNamespace } from 'services/protector';
import { namespace as UserServiceNamespace } from 'services/user';
import { namespace as i18nServiceNamespace } from 'services/i18n';
import { namespace as ConfigServiceNamespace } from 'services/config';
import { namespace as NotificationNamespace } from 'services/notification';
import { namespace as OrderBookDataSourceNamespace } from 'services/orderBookDataSource';
import { namespace as MiniTickerDataSourceNamespace } from 'services/miniTickerDataSource';
import { namespace as OpenOrdersDataSourceNamespace } from 'services/openOrdersDataSource';

import Api from 'services/api/Api';
import Sockets from 'services/sockets/SocketsLib';

export * from '../helpers/redux/namespace';
import { WidgetSettings } from './models';
import { IClientError } from './errors';

export abstract class Module<C = any> {
  public getRoutes?(): ReactElement<RouteProps> | Array<ReactElement<RouteProps>>;
  public getReduxEntry?(): IReduxEntry;
}

export interface IAppData {
  modules: Module[];
  store: Store<IAppReduxState>;
  history: History;
}

export interface IDependencies {
  api: Api;
  sockets: Sockets;
}

export type IDictionary<T, S extends keyof any = string> = {
  [key in S]: T;
};

export interface IReduxEntry {
  reducers?: { [key in keyof IAppReduxState]?: Reducer<IAppReduxState[key]> };
  sagas?: RootSaga[];
}

export interface IFeatureEntry<
  C extends IDictionary<React.ReactType<any>, keyof C> | void,
  A extends IDictionary<ActionCreator<Action>, keyof A> | void,
  S extends IDictionary<(state: any, ...args: any[]) => any, keyof S> | void,
  Settings extends WidgetSettings,
  W extends IDictionary<React.ComponentType<Settings>, keyof W>
  > extends IReduxEntry {
  actions?: A;
  selectors?: S;
  containers?: C;
  widgets?: W;
}

export interface IAppReduxState {
  auth: features.auth.namespace.IReduxState;
  assets: features.assets.namespace.IReduxState;
  balance: features.balance.namespace.IReduxState;
  chat: features.chat.namespace.IReduxState;
  exchangeRates: features.exchangeRates.namespace.IReduxState;
  orders: features.orders.namespace.IReduxState;
  orderBook: features.orderBook.namespace.IReduxState;
  twoFAProvider: features.twoFAProvider.namespace.IReduxState;
  stockChartWidget: IMultiInstanceState<features.stockChart.namespace.IReduxState>;
  profile: features.profile.namespace.IReduxState;
  widgets: features.widgets.namespace.IReduxState;
  users: features.users.namespace.IReduxState;
  i18n: i18nServiceNamespace.IReduxState;
  user: UserServiceNamespace.IReduxState;
  protector: ProtectorNamespace.IReduxState;
  userActivityMonitoring: features.userActivityMonitoring.namespace.IReduxState;
  config: ConfigServiceNamespace.IReduxState;
  tradeHistory: features.tradeHistory.namespace.IReduxState;
  markets: features.markets.namespace.IReduxState;
  operationHistory: features.operationHistory.namespace.IReduxState;
  notification: NotificationNamespace.IReduxState;
  orderBookDataSource: OrderBookDataSourceNamespace.IReduxState;
  miniTickerDataSource: MiniTickerDataSourceNamespace.IReduxState;
  openOrdersDataSource: OpenOrdersDataSourceNamespace.IReduxState;
  placeOrder: features.placeOrder.namespace.IReduxState;
  liquidityPool: features.liquidityPool.namespace.IReduxState;
  forex: features.forex.namespace.IReduxState;
  apiKeys: features.apiKeys.namespace.IReduxState;
  transactions: features.transactions.namespace.IReduxState;
  announcements: features.announcementBar.namespace.IReduxState;
  announcementsAdmin: features.announcementAdmin.namespace.IReduxState;
}

export interface IQueryParams {
  [param: string]: string;
}

export interface IRoutable {
  getPath(queryParams?: IQueryParams): string;
  getElementKey(): string;
}

export interface IHoldingVersion<T extends number> {
  version: T;
}

export interface IMigrator<T extends number> extends IHoldingVersion<T> {
  migrate(x: any): IHoldingVersion<T>;
}

export type RouteTree<T> = { [P in keyof T]: RouteTree<T[P]> & IRoutable };

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type RootSaga = (deps: IDependencies) => () => SagaIterator;

export type Uid = number;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer A>
  ? Array<DeepPartial<A>>
  : T[P] extends ReadonlyArray<infer R>
  ? ReadonlyArray<DeepPartial<R>>
  : DeepPartial<T[P]>
};

export interface ISuccessfulResult<T> {
  kind: 'successfull';
  result: T;
}

export interface IFailedResult<T extends string> {
  kind: 'failed';
  error: IClientError<T>;
}

export type FailableResult<T, E extends string> = ISuccessfulResult<T> | IFailedResult<E>;
