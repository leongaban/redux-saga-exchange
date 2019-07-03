export * from './exchangeRates';
export * from './auth';
export * from './common';
export * from './user';
export * from './widgets';
export * from './orders';
export * from './balance';
export * from './stockChart';
export * from './orderBook';
export * from './tradeHistory';
export * from './markets';
export * from './operationHistory';
export * from './chat';
export * from './assetsInfo';
export * from './assets';
export * from './placeOrder';
export * from './liquidityPool';
export * from './forex';
export * from './reporting';
export * from './mConfig';
export * from './apiKeys';
export * from './transactions';
export * from './annoucements';

export interface ISecuritySettings {
  loginTriesBeforeCaptha: number;
  loginTriesBeforeLock: number;
  loginRetryPeriod: number;
  restorePassTriesBeforeLock: number;
  restorePassRetryPeriod: number;
}
