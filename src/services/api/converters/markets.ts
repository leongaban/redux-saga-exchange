import { ICurrencyPair, IMarket, IEditMarketInfo } from 'shared/types/models';
import { TradeioApiResponseInfoResponse, TradeioApiResponsePairInfo } from 'shared/types/frontoffice_server';
import { IEditMarketRequest } from '../types';
import { getRequiredProperty } from './helpers';

export function convertCurrencyPairsResponse(response: TradeioApiResponseInfoResponse): ICurrencyPair[] {
  if (response.pairs) {
    return Object.entries(response.pairs).map(([key, value]: [string, TradeioApiResponsePairInfo]): ICurrencyPair => {
      return {
        id: key,
        baseCurrency: getRequiredProperty(value.baseAsset, '', 'baseAsset', key),
        counterCurrency: getRequiredProperty(value.quoteAsset, '', 'quoteAsset', key),
        maxPrice: getRequiredProperty(value.maxPrice, 0, 'maxPrice', key),
        minPrice: getRequiredProperty(value.minPrice, 0, 'minPrice', key),
        minAmount: getRequiredProperty(value.minAmount, 0, 'minAmount', key),
        hidden: getRequiredProperty(value.hidden, 0, 'hidden', key),
        fee: getRequiredProperty(value.fee, 0, 'fee', key),
        makerFee: getRequiredProperty(value.makerFee, 0, 'makerFee', key),
        makerFeeLimit: getRequiredProperty(value.makerFeeLimit, 0, 'makerFeeLimit', key),
        takerFee: getRequiredProperty(value.takerFee, 0, 'takerFee', key),
        takerFeeLimit: getRequiredProperty(value.takerFeeLimit, 0, 'takerFeeLimit', key),
        priceScale: getRequiredProperty(value.priceScale, 6, 'priceScale', key),
        amountScale: getRequiredProperty(value.amountScale, 4, 'amountScale', key),
        minOrderValue: getRequiredProperty(value.minOrderValue, 0, 'minOrderValue', key),
        minTradeAmount: getRequiredProperty(value.minTradeAmount, 0, 'minTradeAmount', key),
      };
    });
  }
  return [];
}

export function converMarketsResponse(response: TradeioApiResponseInfoResponse): IMarket[] {
  if (response.pairs) {
    return Object.entries(response.pairs).map(([key, value]: [string, TradeioApiResponsePairInfo]): IMarket => {
      return {
        id: key,
        name: key.replace('_', '/').toUpperCase(),
        nominal: value.baseAsset ? value.baseAsset.toUpperCase() : '',
        limit: value.quoteAsset ? value.quoteAsset.toUpperCase() : '',
        makerFee: value.makerFee ? value.makerFee : 0,
        takerFee: value.takerFee ? value.takerFee : 0,
        priceScale: value.priceScale ? value.priceScale : 0,
        amountScale: value.amountScale ? value.amountScale : 0,
        minOrderValue: value.minOrderValue ? value.minOrderValue : 0,
        minTradeAmount: value.minTradeAmount ? value.minTradeAmount : 0,
        hidden: Boolean(value.hidden),
      };
    });
  }
  return [];
}

export function converMarketRequest(data: IEditMarketInfo): IEditMarketRequest {
  return {
    BaseFee: data.baseFee,
    QuoteFee: data.quoteFee,
    MakerFee: data.makerFee,
    TakerFee: data.takerFee,
    PriceScale: data.priceScale,
    AmountScale: data.amountScale,
    MinOrderValue: data.minOrderValue,
    MinTradeAmount: data.minTradeAmount,
    Hidden: data.hidden,
  };
}
