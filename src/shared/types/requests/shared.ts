import { SortDirection } from '../ui';
import { TwoFAType } from '../models';

export type SideFilterOption = 'all' | 'sell' | 'buy';

export interface IMarketDataFilter {
  fromDate?: number;
  toDate?: number;
  baseCurrency?: string;
  counterCurrency?: string;
  side?: SideFilterOption;
}

export interface ILoadFilteredMarketDataRequest<ColumnData, FilterData extends IMarketDataFilter> {
  page: number;
  perPage: number;
  sortDirection: SortDirection;
  sortColumn: keyof ColumnData;
  filter?: FilterData;
}

export interface IHoldingProvider {
  provider: TwoFAType;
}
