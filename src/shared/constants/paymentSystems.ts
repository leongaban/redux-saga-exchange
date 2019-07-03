// enum for operation cell
export enum paymentSystemName {
  MT5 = 'MetaTrader',
  STELLAR = 'Stellar',
  EOS = 'EOS',
  LIQUIDITY = 'LiquidityPool',
  OMNI = 'Omni',
  OPENPAY = 'OpenPay',
  BITCOIN_CASH = 'BitcoinCash',
  ETHEREUM = 'Ethereum',
  LITECOIN = 'Litecoin',
  BITCOIN = 'Bitcoin'
}

interface IPaymentSystem {
  [key: string]: paymentSystemName;
}

export function getPaymentSystemName(key: string) {
  const paymentKey = key.toUpperCase();
  const paymentsObject = {...paymentSystemName} as IPaymentSystem;
  return paymentsObject.hasOwnProperty(paymentKey) ? paymentsObject[paymentKey] : '';
}
