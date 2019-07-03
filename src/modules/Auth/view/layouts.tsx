import { withLayout } from '../../shared/WithLayout/WithLayout';
import { routes } from '../constants';
import { LoginFormLayout, PasswordRecoveryLayout, RegistrationFormLayout } from './containers';

export const layouts = {
  [routes.auth.login.getPath()]: withLayout({
    desktop: { Content: LoginFormLayout, hideLayout: true },
    mobile: { kind: 'single', Content: LoginFormLayout },
  }),

  [routes.auth['reset-password'].getPath()]: withLayout({
    desktop: { Content: PasswordRecoveryLayout, hideLayout: true },
    mobile: { kind: 'single', Content: PasswordRecoveryLayout },
  }),

  [routes.auth.register.getPath()]: withLayout({
    desktop: { Content: RegistrationFormLayout, hideLayout: true },
    mobile: { kind: 'single', Content: RegistrationFormLayout },
  }),
};
