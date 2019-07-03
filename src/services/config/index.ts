import * as namespace from './namespace';
import { actions, selectors, reducer, getSaga } from './redux';
import { IReduxEntry } from 'shared/types/app';
import { CountryField } from './view/containers';

export * from './contexts';
export { namespace, selectors, actions, CountryField };

export const reduxEntry: IReduxEntry = {
  reducers: { config: reducer },
  sagas: [getSaga],
};
