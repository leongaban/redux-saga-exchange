import * as NS from '../../namespace';
import { initial } from '../initial';

export function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'FOREX:GET_USE_FOREX_SUCCESS':
    case 'FOREX:SET_USE_FOREX_SUCCESS': {
      return {
        ...state,
        useForex: action.payload,
      };
    }
    case 'FOREX:GET_FOREX_BALANCE': {
      return {
        ...state,
        callingGetBalance: true
      };
    }
    case 'FOREX:CREATE_FOREX_ACCOUNT_SUCCESS': {
      return {
        ...state,
        message: action.payload.message,
      };
    }
    case 'FOREX:GET_FOREX_BALANCE_SUCCESS': {
      return {
        ...state,
        ...action.payload,
        callingGetBalance: false
      };
    }
    case 'FOREX:WITHDRAW_FROM_MT5_SUCCESS': {
      return {
        ...state,
        message: action.payload.message
      };
    }
    default: return state;
  }
}
