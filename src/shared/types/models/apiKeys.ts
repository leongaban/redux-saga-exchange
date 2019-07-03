export interface IApiKey {
  name: string;
  publicKey: string;
  isReadAccess: boolean;
  isTrading: boolean;
  isWithdrawal: boolean;
  ipAddressList: string[];
  privateKey?: string;
}

export interface IServerApiKey {
  name: string;
  publicKey: string;
  isInfo?: boolean;
  isTrade?: boolean;
  isWithdraw?: boolean;
  ipWhiteList?: string[];
  privateKey?: string;
}

export interface ICreateApiKeyRequest {
  name: string;
  isInfo: boolean;
  isTrade: boolean;
  isWithdraw: boolean;
  ipWhiteList: string[];
}
