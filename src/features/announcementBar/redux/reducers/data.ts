import { IReduxState, Action } from '../../namespace';
import { initial } from './initial';

export function dataReducer(state: IReduxState['data'] = initial.data, action: Action): IReduxState['data'] {
  switch (action.type) {
    case 'ANNOUNCEMENT:LOAD_SUCCESS':
      return {
        ...state,
        items: action.payload,
      };
    default: return state;
  }
}
