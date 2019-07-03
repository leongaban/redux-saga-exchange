import { bind } from 'decko';
import { Dispatch } from 'redux';

import { ApiErrorInterceptor } from 'shared/types/errors';

import HttpActions from './HttpActions';
import AuthApi from './Auth';
import StorageApi from './Storage';
import ConfigApi from './Config';
import OrdersApi from './Orders';
import ProfileApi from './Profile';
import BalanceApi from './Balance';
import ExchangeRatesApi from './ExchangeRates';
import UsersApi from './Users';
import TradeHistoryApi from './tradeHistory';
import MarketsApi from './markets';
import LiquidityPoolApi from './LiquidityPool';
import DocumentApi from './Document';
import ForexApi from './Forex';
import AnnouncementsApi from './Announcements';

class Api {
  public auth: AuthApi;
  public config: ConfigApi;
  public storage: StorageApi;
  public orders: OrdersApi;
  public profile: ProfileApi;
  public balance: BalanceApi;
  public exchangeRates: ExchangeRatesApi;
  public users: UsersApi;
  public tradeHistory: TradeHistoryApi;
  public markets: MarketsApi;
  public liquidityPool: LiquidityPoolApi;
  public forex: ForexApi;
  public document: DocumentApi;
  public announcements: AnnouncementsApi;
  // TODO remove, add for progress bar
  public dispatch: Dispatch<any>;

  private actions: HttpActions;
  private errorInterceptors: ApiErrorInterceptor[] = [];

  constructor() {
    this.actions = new HttpActions('', this.errorInterceptors);
    this.auth = new AuthApi(this.actions);
    this.storage = new StorageApi(this.actions);
    this.config = new ConfigApi(this.actions);
    this.orders = new OrdersApi(this.actions);
    this.users = new UsersApi(this.actions);
    this.profile = new ProfileApi(this.actions);
    this.balance = new BalanceApi(this.actions);
    this.exchangeRates = new ExchangeRatesApi(this.actions);
    this.tradeHistory = new TradeHistoryApi(this.actions);
    this.markets = new MarketsApi(this.actions);
    this.liquidityPool = new LiquidityPoolApi(this.actions);
    this.forex = new ForexApi(this.actions);
    this.document = new DocumentApi();
    this.announcements = new AnnouncementsApi(this.actions);
  }

  // TODO remove, add for progress bar
  public initializeDispatch(dispatch: Dispatch<any>) {
    this.dispatch = dispatch;
  }

  @bind
  public addErrorInterceptor(errorInterceptor: ApiErrorInterceptor) {
    this.errorInterceptors.push(errorInterceptor);
  }
}

export default Api;
