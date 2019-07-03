import { IPlainAction } from '../../../types/redux';

export type IResetAppStateAction = IPlainAction<'APP:RESET'>;

function resetAppState(): IResetAppStateAction {
  return { type: 'APP:RESET' };
}

export default resetAppState;
