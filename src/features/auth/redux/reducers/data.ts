import * as NS from '../../namespace';
import initial from '../data/initial';

function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'AUTH:SET_TWO_FACTOR_INFO': {
      return {
        ...state,
        twoFactorInfo: action.payload,
      };
    }
    default: return state;
  }
}

export default dataReducer;
