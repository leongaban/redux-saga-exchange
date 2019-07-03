import { makeReduxFormEntry } from 'shared/helpers/redux';
import * as NS from '../namespace';

export const editMarketFormEntry = makeReduxFormEntry<NS.IEditMarketForm>('edit-market',
  [
    'id', 'makerFee', 'takerFee', 'baseFee', 'quoteFee', 'priceScale', 'amountScale',
    'minTradeAmount', 'minOrderValue',
  ]);
