import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { Module } from 'shared/types/app';
import { adminIsLogged, adminIsNotLogged } from 'modules/shared/checkAuth';

import { routes } from './constants';
import UsersLayout from './view/containers/UsersLayout/UsersLayout';
import MarketsLayout from './view/containers/MarketsLayout/MarketsLayout';
import AssetsLayout from './view/containers/AssetsLayout/AssetsLayout';
import LoginLayout from './view/containers/LoginLayout/LoginLayout';
import LogoutLayout from './view/containers/LogoutLayout/LogoutLayout';
import AnnouncementsLayout from './view/containers/AnnouncementsLayout/AnnouncementsLayout';

export default class AdminModule extends Module {

  public getRoutes() {
    return (
      <Route
        key={routes.admin.getElementKey()}
        path={routes.admin.getPath()}
      >
        <Switch>
          <Route
            key={routes.admin.login.getElementKey()}
            path={routes.admin.login.getPath()}
            component={adminIsNotLogged(LoginLayout as any)}
          />
          <Route
            key={routes.admin.logout.getElementKey()}
            path={routes.admin.logout.getPath()}
            component={LogoutLayout}
          />
          <Route
            key={routes.admin.users.getElementKey()}
            path={`${routes.admin.users.getPath()}/:filter?`}
            component={adminIsLogged(UsersLayout as any)}
          />
          <Route
            key={routes.admin.markets.getElementKey()}
            path={routes.admin.markets.getPath()}
            component={adminIsLogged(MarketsLayout as any)}
          />
          <Route
            key={routes.admin.assets.getElementKey()}
            path={routes.admin.assets.getPath()}
            component={adminIsLogged(AssetsLayout as any)}
          />
          <Route
            key={routes.admin.announcements.getElementKey()}
            path={routes.admin.announcements.getPath()}
            component={adminIsLogged(AnnouncementsLayout as any)}
          />
          <Redirect exact from={routes.admin.getPath()} to={routes.admin.users.getPath()} />
        </Switch>
      </Route>
    );
  }
}
