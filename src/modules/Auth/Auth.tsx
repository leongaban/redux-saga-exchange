import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { compose } from 'redux';

import {
  userIsNotLogged,
  userIsLogged,
  userDidNotAcceptTOS,
  userDidNotConfirmSecurityNotice
} from 'modules/shared/checkAuth';

import { routes } from './constants';
import { Module } from '../../shared/types/app';
import {
  ChangePasswordLayout, ConfirmEmailLayout, LogoutLayout, TermsOfServiceLayout,
  ThankYouLayout,
} from './view/containers';
import { layouts } from './view/layouts';
import SecurityNoticeLayout from './view/containers/SecurityNoticeLayout/SecurityNoticeLayout';

const userIsLoggedAndDidNotAcceptTOS = compose(userIsLogged, userDidNotAcceptTOS);
const userIsLoggedAndDidNotReadSecurityNotice = compose(userIsLogged, userDidNotConfirmSecurityNotice);

class AuthModule extends Module {
  public getRoutes() {
    return [
      (
        <Route key={routes.auth.getElementKey()} path={routes.auth.getPath()}>
          <Switch>
            <Route
              key={routes.auth.login.getElementKey()}
              path={routes.auth.login.getPath()}
              component={userIsNotLogged(layouts[routes.auth.login.getPath()] as any)}
            />
            <Route
              key={routes.auth.register.getElementKey()}
              path={routes.auth.register.getPath()}
              component={userIsNotLogged(layouts[routes.auth.register.getPath()] as any)}
            />
            <Route
              key={routes.auth['reset-password'].getElementKey()}
              path={routes.auth['reset-password'].getPath()}
              component={userIsNotLogged(layouts[routes.auth['reset-password'].getPath()] as any)}
            />
            <Route
              key={routes.auth['thank-you'].getElementKey()}
              path={routes.auth['thank-you'].getPath()}
              component={userIsNotLogged(ThankYouLayout as any)}
            />
            <Route
              key={routes.auth.tos.getElementKey()}
              path={routes.auth.tos.getPath()}
              component={userIsLoggedAndDidNotAcceptTOS(TermsOfServiceLayout as any)}
            />
            <Route
              key={routes.auth['security-notice'].getElementKey()}
              path={routes.auth['security-notice'].getPath()}
              component={userIsLoggedAndDidNotReadSecurityNotice(SecurityNoticeLayout as any)}
            />
            <Route
              key={routes.auth.logout.getElementKey()}
              path={routes.auth.logout.getPath()}
              component={LogoutLayout}
            />
            <Route
              key={routes.auth['confirm-email'].getElementKey()}
              path={routes.auth['confirm-email'].getPath()}
              component={ConfirmEmailLayout}
            />
            <Route
              key={routes.auth['restore-password'].getElementKey()}
              path={routes.auth['restore-password'].getPath()}
              component={ChangePasswordLayout}
            />
            <Redirect exact from={routes.auth.getPath()} to={routes.auth.login.getPath()} />
          </Switch>
        </Route>
      ),
    ];
  }
}

export default AuthModule;
