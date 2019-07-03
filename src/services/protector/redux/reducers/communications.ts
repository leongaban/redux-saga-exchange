import { makeCommunicationReducer } from 'shared/helpers/redux';
import { ReducersMap } from 'shared/types/redux';
import { combineReducers } from 'redux';

import initial from '../data/initial';

import * as NS from '../../namespace';

export default combineReducers<NS.IReduxState['communications']>({
  verify: makeCommunicationReducer<NS.IVerify, NS.IVerifySuccess, NS.IVerifyFail>(
    'PROTECTOR:VERIFY',
    'PROTECTOR:VERIFY_SUCCESS',
    'PROTECTOR:VERIFY_FAIL',
    initial.communications.verify,
  ),
} as ReducersMap<NS.IReduxState['communications']>);
