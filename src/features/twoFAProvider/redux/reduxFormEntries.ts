import { makeReduxFormEntry } from 'shared/helpers/redux';
import * as NS from '../namespace';

export const toggle2faFormEntry = makeReduxFormEntry<NS.IToggle2faForm>('toggle-2fa',
  ['code', 'new2FaProviderCode']);
