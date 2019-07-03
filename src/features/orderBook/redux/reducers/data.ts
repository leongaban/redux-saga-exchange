import * as NS from '../../namespace';
import { initial } from '../data/initial';

export function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'ORDER_BOOK:SET_LAST_PRICE': {
      if (action.payload === null) {
        return {
          ...state,
          lastPrice: action.payload,
        };
      }
      const prevPrice = state.lastPrice !== null ? state.lastPrice.value : 0;
      const newPrice = action.payload.close;
      const changePrice = (() => {
        if (prevPrice < newPrice) {
          return 'increased';
        } else if (prevPrice > newPrice) {
          return 'decreased';
        }
        return 'unchanged';
      })();
      return {
        ...state,
        lastPrice: {
          value: newPrice,
          change: changePrice,
        },
      };
    }
    default: return state;
  }
}
