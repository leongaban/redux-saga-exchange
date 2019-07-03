import { ICountry } from 'shared/types/models';

export interface IForexRegistrationForm {
  leverage: number;
  baseAsset: string;
  address: string;
  city: string;
  country: ICountry;
  postcode: string;
}

export interface IForexAccount {
  name: string;
  leverage: number;
  baseAsset: string;
  address: string;
}

export interface IForexLinks {
  windows: string;
  mac: string;
  web: string;
  ios: string;
  android: string;
  fxPlatform: string;
  fxPricing: string;
}

export const fxPlatformLink = 'https://trd.io/fx-platform';
export const pricingLink = 'https://trd.io/en/fx-pricing';

// tslint:disable:max-line-length
export const forexDocClient = 'https://tradeiogeneralstore.blob.core.windows.net/tmdocs/TM_Client_Agreement.pdf';
export const forexDocExecution = 'https://tradeiogeneralstore.blob.core.windows.net/tmdocs/TM_Execution_Policy.pdf';
export const forexDocLeverage = 'https://tradeiogeneralstore.blob.core.windows.net/tmdocs/TM_Leverage_Policy.pdf';
export const forexDocPrivacy = 'https://tradeiogeneralstore.blob.core.windows.net/tmdocs/TM_Privacy_Policy.pdf';
export const forexDocRisk = 'https://tradeiogeneralstore.blob.core.windows.net/tmdocs/TM_Risk_Disclosure.pdf';

export const windowsLink = 'https://download.mql5.com/cdn/web/tio.markets.ltd/mt5/tiomarkets5setup.exe';
export const macLink = 'https://www.mql5.com/en/articles/619?utm_source=www.metatrader5.com&utm_campaign=download.mt5.macos';
export const webLink = 'https://webtrader.tiomarkets.com/';
export const iosLink = 'https://download.mql5.com/cdn/mobile/mt5/ios?utm_source=www.metatrader5.com&utm_campaign=download';
export const androidLink = 'https://play.google.com/store/apps/details?id=net.metaquotes.metatrader5&hl=en&referrer=ref_id%3d28baef71%26utm_source%3dwww.metatrader5.com%26utm_campaign%3ddownload';
