import * as NS from '../../namespace';
import { initial } from '../initial';

export function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'LIQUIDITY-POOL:GET_TIO_LOCKED_BALANCE_SUCCESS': {
      return {
        ...state,
        tioLocked: action.payload,
      };
    }
    case 'LIQUIDITY-POOL:GET_TOTAL_TIO_SUCCESS': {
      return {
        ...state,
        totalTio: action.payload,
      };
    }
    case 'LIQUIDITY-POOL:GET_LP_ASSETS_SUCCESS': {
      return {
        ...state,
        ...action.payload,
      };
    }
    case 'LIQUIDITY-POOL:GET_USE_LP_SUCCESS':
    case 'LIQUIDITY-POOL:SET_USE_LP_SUCCESS': {
      return {
        ...state,
        useLiquidityPool: action.payload,
      };
    }
    case 'LIQUIDITY-POOL:POST_LOAN_AGREEMENT_SUCCESS': {
      return {
        ...state,
        pandaDocUrl: action.payload.pandaDocUrl,
        pandaDocId: action.payload.pandaDocId
      };
    }
    case 'LIQUIDITY-POOL:REMOVE_LOAN_AGREEMENT': {
      return {
        ...state,
        pandaDocUrl: undefined,
      };
    }
    default: return state;
  }
}
