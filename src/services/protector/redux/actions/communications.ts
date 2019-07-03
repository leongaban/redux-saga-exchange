import * as NS from '../../namespace';
import { makeCommunicationActionCreators } from 'shared/helpers/redux';

export const { execute: verify, completed: verifySuccess, failed: verifyFail } =
  makeCommunicationActionCreators<NS.IVerify, NS.IVerifySuccess, NS.IVerifyFail>(
    'PROTECTOR:VERIFY', 'PROTECTOR:VERIFY_SUCCESS', 'PROTECTOR:VERIFY_FAIL',
  );
