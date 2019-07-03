import { getFormValues } from 'redux-form';

import { IAppReduxState } from 'shared/types/app';
import { ICommunication } from 'shared/types/redux';
import { IDepositAddressData } from 'shared/types/models';

import * as NS from '../namespace';
import { withdrawCoinsFormEntry } from './reduxFormEntries';

export function getFeatureState(state: IAppReduxState): NS.IReduxState {
  return state.balance;
}

export function selectModals(state: IAppReduxState) {
  return getFeatureState(state).ui.modals;
}

export function selectDepositAddress(state: IAppReduxState): IDepositAddressData | null {
  return getFeatureState(state).ui.modals.depositCoins.address;
}

export function selectWithdrawAmount(state: IAppReduxState): string | null {
  const { name } = withdrawCoinsFormEntry;

  const formState = getFormValues(name)(state) as NS.IWithdrawCoinsFormData;
  if (formState) {
    return formState.amount;
  }
  return null;
}

export function selectCommunication(state: IAppReduxState, key: keyof NS.IReduxState['communication']): ICommunication {
  return getFeatureState(state).communication[key];
}
