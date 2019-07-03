
import * as namespace from './namespace';
import { actions, selectors, reducer, getSaga, protect } from './redux';
import { IReduxEntry } from 'shared/types/app';
import * as containers from './view/containers';

export { namespace, selectors, actions, containers, protect };

export const reduxEntry: IReduxEntry = {
  reducers: { protector: reducer },
  sagas: [getSaga],
};
