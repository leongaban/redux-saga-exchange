import { actions, getSaga } from './redux';
import { IReduxEntry } from 'shared/types/app';
import * as namespace from './namespace';

export { namespace, actions };

export const reduxEntry: IReduxEntry = {
  sagas: [getSaga],
};
