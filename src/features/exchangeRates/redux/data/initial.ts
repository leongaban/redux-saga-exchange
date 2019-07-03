import { initialCommunicationField } from 'shared/helpers/redux';
import { IReduxState } from '../../namespace';

export const initial: IReduxState = {
  communication: {
    toggleMarketStatus: initialCommunicationField,
    loadFavorites: initialCommunicationField,
  },
  data: {
    favorites: [],
  },
  ui: {
    filteredCounterCurrency: null,
    showOnlyFavorites: false,
    searchValue: '',
  }
};
