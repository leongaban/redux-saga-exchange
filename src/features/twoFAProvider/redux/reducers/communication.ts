import { combineReducers } from 'redux';
import { makeCommunicationReducer } from 'shared/helpers/redux';

import { ReducersMap } from 'shared/types/redux';
import * as NS from '../../namespace';

import { initial } from '../initial';

// tslint:disable:max-line-length
export const communicationReducer = combineReducers<NS.IReduxState['communication']>({
  sendCodeToEmail: makeCommunicationReducer<NS.ISendCodeToEmail, NS.ISendCodeToEmailSuccess, NS.ISendCodeToEmailFail>(
    'TWO_FA_PROVIDER:SEND_CODE_TO_EMAIL',
    'TWO_FA_PROVIDER:SEND_CODE_TO_EMAIL_SUCCESS',
    'TWO_FA_PROVIDER:SEND_CODE_TO_EMAIL_FAIL',
    initial.communication.sendCodeToEmail,
  ),
  sendVerificationCode: makeCommunicationReducer<NS.ISendVerificationCode, NS.ISendVerificationCodeSuccess, NS.ISendVerificationCodeFail>(
    'TWO_FA_PROVIDER:SEND_VERIFICATION_CODE',
    'TWO_FA_PROVIDER:SEND_VERIFICATION_CODE_SUCCESS',
    'TWO_FA_PROVIDER:SEND_VERIFICATION_CODE_FAIL',
    initial.communication.sendVerificationCode,
  ),
  loadSecretInfo: makeCommunicationReducer<NS.ILoadSecretInfo, NS.ILoadSecretInfoSuccess, NS.ILoadSecretInfoFail>(
    'TWO_FA_PROVIDER:LOAD_SECRET_INFO',
    'TWO_FA_PROVIDER:LOAD_SECRET_INFO_SUCCESS',
    'TWO_FA_PROVIDER:LOAD_SECRET_INFO_FAIL',
    initial.communication.loadSecretInfo,
  ),
  disabe2FA: makeCommunicationReducer<NS.IDisable2FA, NS.IDisable2FASuccess, NS.IDisable2FAFail>(
    'TWO_FA_PROVIDER:DISABLE_2FA',
    'TWO_FA_PROVIDER:DISABLE_2FA_SUCCESS',
    'TWO_FA_PROVIDER:DISABLE_2FA_FAIL',
    initial.communication.disabe2FA,
  ),
} as ReducersMap<NS.IReduxState['communication']>);
