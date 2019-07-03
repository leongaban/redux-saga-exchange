import { IGetForexBalanceResponse, IGetForexBalanceData } from 'shared/types/requests/forex';

export function convertBalanceData(data: IGetForexBalanceResponse): IGetForexBalanceData {
  return {
    asset: data.asset,
    balance: data.balance,
    credit: data.credit,
    equity: data.equity,
    exchangeRate: data.exchange_rate,
    floating: data.floating,
    freeMargin: data.free_margin,
    leverage: data.leverage,
    profit: data.profit,
    margin: data.margin,
    marginLevel: data.margin_level,
    message: data.message,
    mt5LoginId: data.mt5_login_id,
  };
}
