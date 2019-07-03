import { IAppReduxState } from 'shared/types/app';
import { IPaginatedData, ITransaction } from 'shared/types/models';
import { ICommunication } from 'shared/types/redux';

import * as NS from '../../namespace';

export function selectFeatureState(state: IAppReduxState): NS.IReduxState {
  return state.transactions;
}

export function selectTransactions(state: IAppReduxState): IPaginatedData<ITransaction[]> {
  return selectFeatureState(state).data.transactions;
}

export function selectLoadTransactions(state: IAppReduxState): ICommunication {
  return selectFeatureState(state).communication.loadTransactions;
}
