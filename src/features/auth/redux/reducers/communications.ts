import { combineReducers } from 'redux';
import * as NS from '../../namespace';

import initial from '../data/initial';
import { ReducersMap } from 'shared/types/redux';
import makeCommunicationReducer from 'shared/helpers/redux/communication/makeCommunicationReducer';

// tslint:disable:max-line-length
export default combineReducers<NS.IReduxState['communications']>({
    login: makeCommunicationReducer<NS.ILogin, NS.ILoginSuccess, NS.ILoginFail>(
        'AUTH:LOGIN',
        'AUTH:LOGIN_SUCCESS',
        'AUTH:LOGIN_FAIL',
        initial.communications.login,
    ),
    register: makeCommunicationReducer<NS.IRegister, NS.IRegisterSuccess, NS.IRegisterFail>(
        'AUTH:REGISTER',
        'AUTH:REGISTER_SUCCESS',
        'AUTH:REGISTER_FAIL',
        initial.communications.register,
    ),
    resetPassword: makeCommunicationReducer<NS.IResetPassword, NS.IResetPasswordSuccess, NS.IResetPasswordFail>(
        'AUTH:RESET_PASSWORD',
        'AUTH:RESET_PASSWORD_SUCCESS',
        'AUTH:RESET_PASSWORD_FAIL',
        initial.communications.resetPassword,
    ),
    changePassword: makeCommunicationReducer<NS.IChangePassword, NS.IChangePasswordSuccess, NS.IChangePasswordFail>(
        'AUTH:CHANGE_PASSWORD',
        'AUTH:CHANGE_PASSWORD_SUCCESS',
        'AUTH:CHANGE_PASSWORD_FAIL',
        initial.communications.changePassword,
    ),
    logout: makeCommunicationReducer<NS.ILogout, NS.ILogoutSuccess, NS.ILogoutFail>(
        'AUTH:LOGOUT',
        'AUTH:LOGOUT_SUCCESS',
        'AUTH:LOGOUT_FAIL',
        initial.communications.logout,
    ),
    confirmEmail: makeCommunicationReducer<NS.IConfirmEmail, NS.IConfirmEmailSuccess, NS.IConfirmEmailFail>(
        'AUTH:CONFIRM_EMAIL',
        'AUTH:CONFIRM_EMAIL_SUCCESS',
        'AUTH:CONFIRM_EMAIL_FAIL',
        initial.communications.confirmEmail,
    ),
    sendTwoFactorVerificationData: makeCommunicationReducer<NS.ISendTwoFactorVerificationData, NS.ISendTwoFactorVerificationDataSuccess, NS.ISendTwoFactorVerificationDataFail>(
        'AUTH:SEND_TWO_FACTOR_DATA',
        'AUTH:SEND_TWO_FACTOR_DATA_SUCCESS',
        'AUTH:SEND_TWO_FACTOR_DATA_FAIL',
        initial.communications.sendTwoFactorVerificationData,
    ),
    validateNickname: makeCommunicationReducer<NS.IValidateNickname, NS.IValidateNicknameSuccess, NS.IValidateNicknameFail>(
        'AUTH:VALIDATE_NICKNAME',
        'AUTH:VALIDATE_NICKNAME_SUCCESS',
        'AUTH:VALIDATE_NICKNAME_FAIL',
        initial.communications.validateNickname,
    ),
} as ReducersMap<NS.IReduxState['communications']>);
