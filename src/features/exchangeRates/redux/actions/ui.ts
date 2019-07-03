import * as NS from '../../namespace';

export function setFilteredCounterCurrency(payload: string | null): NS.ISetFilteredCounterCurrency {
  return { type: 'EXCHANGE_RATES:SET_FILTERED_COUNTER_CURRENCY', payload };
}

export function setShowOnlyFavorites(payload: boolean): NS.ISetShowOnlyFavorites {
  return { type: 'EXCHANGE_RATES:SET_SHOW_ONLY_FAVORITES', payload };
}

export function setSearchValue(payload: string): NS.ISetSearchValue {
  return { type: 'EXCHANGE_RATES:SET_SEARCH_VALUE', payload };
}

export function resetUI(): NS.IResetUI {
  return { type: 'EXCHANGE_RATES:RESET_UI' };
}
