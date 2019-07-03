import { IAppReduxState } from '../../../types/app';
import { IResetAppStateAction } from './resetAppStateAction';

function resetAppStateReducer(state: IAppReduxState, action: IResetAppStateAction) {
  switch (action.type) {
    case 'APP:RESET':
      return undefined;
    default:
      return state;
  }
}

export default resetAppStateReducer;
