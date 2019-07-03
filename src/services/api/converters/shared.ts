import moment from 'services/moment';
import { IMarketDataFilter } from 'shared/types/requests';
import { IMarketDataFilterRequest } from 'services/api/types/requests';

export function convertToServerMarketDataFilter(filter: IMarketDataFilter): IMarketDataFilterRequest {
  const Side = (() => {
    if (filter.side === 'buy') {
      return 0;
    } else if (filter.side === 'sell') {
      return 1;
    }
  })();
  const Market = (() => {
    if (filter.baseCurrency && filter.counterCurrency) {
      return (`${filter.baseCurrency}_${filter.counterCurrency}`).toLowerCase();
    }
  })();
  const Asset = (() => {
    if (filter.baseCurrency && filter.counterCurrency) {
      return undefined;
    } else if (filter.baseCurrency) {
      return filter.baseCurrency;
    } else if (filter.counterCurrency) {
      return filter.counterCurrency;
    }
  })();
  return {
    Market,
    Asset,
    Side,
    StartDate: filter.fromDate !== void 1 ? moment(filter.fromDate).format() : void 1,
    EndDate: filter.toDate !== void 1 ? moment(filter.toDate).format() : void 1,
  };
}
