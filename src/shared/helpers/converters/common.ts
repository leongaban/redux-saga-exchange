
import { ICountry } from 'shared/types/models';

export function convertCountry(data: Partial<ICountry>): ICountry {
  return {
    code: data.code || '',
    id: data.id || '',
    kyc: data.kyc || '',
    name: data.name || '',
  };
}

// Transforms asset or market name to uppercase and hack for TIOx
export function transformAssetName(value: string) {
  return value.toUpperCase().replace('TIOX', 'TIOx');
}

// btc_usdt -> BTC/USDT
export function convertMarketFromUnderscoreToSlash(marketName: string): string {
  return marketName.replace('_', '/').toUpperCase();
}

// BTC/USDT -> btc_usdt
export function convertMarketFromSlashToUnderscore(marketName: string): string {
  return marketName.replace('/', '_').toLowerCase();
}
