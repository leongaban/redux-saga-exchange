import { makeReduxFormEntry } from 'shared/helpers/redux';
import * as NS from '../../namespace';

export const loginFormEntry = makeReduxFormEntry<NS.ILoginForm>('loginForm',
  ['email', 'password', 'remember']);

export const passwordRecoveryFormEntry = makeReduxFormEntry<NS.IPasswordRecoveryForm>('passwordRecovery',
  ['email', 'captcha']);

export const changePasswordFormEntry = makeReduxFormEntry<NS.IChangePasswordForm>('changePassword',
  ['password', 'passwordConfirm']);

export const registrationFormEntry = makeReduxFormEntry<NS.IRegistrationForm>('registration',
  ['email', 'password', 'passwordConfirm', 'nickname', 'captcha']);

export const twoFactorFormEntry = makeReduxFormEntry<NS.ITwoFactorForm>('twoFactorForm', ['code']);
