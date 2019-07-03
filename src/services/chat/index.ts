import * as namespace from './namespace';
import { actions, getSaga } from './redux';
import {IReduxEntry} from 'shared/types/app';

export { namespace, actions };

export const reduxEntry: IReduxEntry = {
  sagas: [ getSaga ],
};
