import { makeReduxFormEntry } from 'shared/helpers/redux';
import * as NS from '../namespace';

export const newApiKeyFormEntry = makeReduxFormEntry<NS.INewApiKeyForm>('newApiKey',
  ['label', 'readAccess', 'trading', 'withdrawal', 'ipAddressList']);
