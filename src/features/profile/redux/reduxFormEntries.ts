import { makeReduxFormEntry } from 'shared/helpers/redux';
import { IPersonalDataForm } from 'shared/types/models';

export const personalDataFormEntry = makeReduxFormEntry<IPersonalDataForm>('personalData',
  ['email', 'nickname', 'firstName', 'middleName', 'lastName',
    'address', 'city', 'country', 'postCode', 'avatar', 'documents']);
