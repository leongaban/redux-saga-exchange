import * as React from 'react';
import { compose } from 'redux';
import { Route, Switch } from 'react-router-dom';

import { userIsLogged, userAcceptedTOS, userConfirmedSecurityNotice } from 'modules/shared/checkAuth';
import { Module } from 'shared/types/app';

import { layouts } from './view/layouts';
import { ConfirmWithdrawalLayout } from './view/containers';
import { routes } from './constants';

const userIsCleared = compose(userIsLogged, userAcceptedTOS, userConfirmedSecurityNotice);

class BalanceModule extends Module {
  public getRoutes() {
    return (
      <Route
        key={routes.balance.getElementKey()}
        path={routes.balance.getPath()}
      >
        <Switch>
          <Route
            key={routes.balance['confirm-withdrawal'].getElementKey()}
            path={routes.balance['confirm-withdrawal'].getPath()}
            component={userIsCleared(ConfirmWithdrawalLayout as any)}
          />
          <Route
            key={routes.balance.getElementKey()}
            path={routes.balance.getPath()}
            component={userIsCleared(layouts[routes.balance.getPath()] as any)}
          />
        </Switch>
      </Route>
    );
  }
}

export default BalanceModule;
