import { makeReduxFormEntry } from 'shared/helpers/redux';
import { IBalanceSettings } from 'shared/types/models';
import * as NS from '../namespace';

export const withdrawCoinsFormEntry = makeReduxFormEntry<NS.IWithdrawCoinsFormData>(
  'withdrawCoinsForm', ['amount', 'address', 'memo', 'newAddressLabel', 'newAddress'],
);

export const balanceSettingsFormEntry = makeReduxFormEntry<IBalanceSettings>(
  'balanceSettings', ['currencyCodes'],
);
