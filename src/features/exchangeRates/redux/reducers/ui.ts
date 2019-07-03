import * as NS from '../../namespace';
import { initial } from '../data/initial';

function uiReducer(state: NS.IReduxState['ui'] = initial.ui, action: NS.Action): NS.IReduxState['ui'] {
  switch (action.type) {
    case 'EXCHANGE_RATES:SET_FILTERED_COUNTER_CURRENCY':
      return {
        ...state,
        filteredCounterCurrency: action.payload,
      };
    case 'EXCHANGE_RATES:SET_SHOW_ONLY_FAVORITES':
      return {
        ...state,
        showOnlyFavorites: action.payload,
      };
    case 'EXCHANGE_RATES:SET_SEARCH_VALUE':
      return {
        ...state,
        searchValue: action.payload,
      };
    case 'EXCHANGE_RATES:RESET_UI':
      return initial.ui;
    default: return state;
  }
}

export default uiReducer;
