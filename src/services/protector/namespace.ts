import { IPlainAction, ICommunication, IPlainFailAction, IAction } from 'shared/types/redux';
import { IDependencies } from 'shared/types/app';
import { TwoFAType } from 'shared/types/models';
// import { SagaIterator } from 'redux-saga';

export interface IReduxState {
  edit: {
    retries: number;
    provider: TwoFAType;
  };
  ui: {
    isVerificationModalOpen: boolean;
  };
  communications: {
    verify: ICommunication;
  };
}

export interface IVerificationCodeForm {
  code: string;
}

export type IProtectedSaga = (deps: IDependencies, ...args: any[]) => any;

export type IToggleVerificationModalState = IPlainAction<'PROTECTOR:TOGGLE_VERIFICATION_MODAL_STATE'>;
export type ITerminateVerification = IPlainAction<'PROTECTOR:TERMINATE_VERIFICATION'>;
export type ISetProvider = IAction<'PROTECTOR:SET_PROVIDER', TwoFAType>;
export type ISetRetriesAmount = IAction<'PROTECTOR:SET_RETRIES_AMOUNT', number>;
export type ISetCodeFieldValue = IAction<'PROTECTOR:SET_CODE_FIELD_VALUE', string>;

export type IReset = IPlainAction<'PROTECTOR:RESET'>;

export type IVerify = IAction<'PROTECTOR:VERIFY', string>;
export type IVerifySuccess = IPlainAction<'PROTECTOR:VERIFY_SUCCESS'>;
export type IVerifyFail = IPlainFailAction<'PROTECTOR:VERIFY_FAIL'>;

export type Action = IToggleVerificationModalState | ISetProvider | ISetCodeFieldValue
  | ISetRetriesAmount | IReset | IVerify | IVerifySuccess | IVerifyFail;
