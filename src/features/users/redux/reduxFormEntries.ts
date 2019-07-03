import { makeReduxFormEntry } from 'shared/helpers/redux';
import * as NS from '../namespace';

export const usersFormEntry = makeReduxFormEntry<NS.IUsersForm>('user-profile',
  ['nickname',
    'email',
    'firstName',
    'middleName',
    'lastName',
    'country',
    'role',
    'isEmailConfirmed',
    'twoFactorEnabled']);
