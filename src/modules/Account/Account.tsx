import * as React from 'react';
import { compose } from 'redux';
import { Route, Redirect, Switch } from 'react-router-dom';

import { Module, IRoutable } from 'shared/types/app';
import { userIsLogged, userAcceptedTOS, userConfirmedSecurityNotice } from 'modules/shared/checkAuth';
import { routes } from './constants';
import { layouts } from './view/layouts';

const userIsCleared = compose(userIsLogged, userAcceptedTOS, userConfirmedSecurityNotice);

class AccountModule extends Module {
  public getRoutes() {
    return [(
      <Route
        key={routes.account.getElementKey()}
        path={routes.account.getPath()}
      >
        <Switch>
          <Redirect exact from={routes.account.getPath()} to={routes.account.profile.getPath()} />
          {this.renderAccountRoutes()}
        </Switch>
      </Route>
    ), (
      // redirect for those, who keep old profile link into bookmarks, not to confuse our users
      <Redirect exact from="/profile" to={routes.account.profile.getPath()} />
    )];
  }

  private renderAccountRoutes() {
    const routesToRender: IRoutable[] = [routes.account.profile, routes.account.security, routes.account['api-keys']];

    return routesToRender.map(x => {
      return (
        <Route
          key={x.getElementKey()}
          path={x.getPath()}
          component={userIsCleared(layouts[x.getPath()] as any)}
        />
      );
    });
  }

}

export default AccountModule;
