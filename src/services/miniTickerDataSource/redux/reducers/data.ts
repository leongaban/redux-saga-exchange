import * as NS from '../../namespace';
import { initial } from '../data/initial';

export function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'MINITICKER_DATA_SOURCE:APPLY_MINITICKER_DIFF': {
      return {
        ...state,
        exchangeRates: {
          ...state.exchangeRates,
          ...action.payload,
        },
      };
    }
    default: return state;
  }
}
