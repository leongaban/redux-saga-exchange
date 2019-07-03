import * as React from 'react';
import { compose } from 'redux';
import { Route, Switch } from 'react-router-dom';

import { Module } from 'shared/types/app';
import { userIsLogged, userAcceptedTOS, userConfirmedSecurityNotice } from 'modules/shared/checkAuth';

import { layouts } from './view/layouts';
import { routes } from './constants';
import * as NS from './namespace';

const userIsCleared = compose(userIsLogged, userAcceptedTOS, userConfirmedSecurityNotice);

class TradeModule extends Module {
  public getRoutes() {

    return (
      <Route
        key={routes.trade.getElementKey()}
        path={routes.trade.getPath()}
      >
        <Switch>
          <Route
            key={routes.trade.classic.getElementKey()}
            path={routes.trade.classic.getPath()}
            component={userIsCleared(layouts[routes.trade.classic.getPath()] as any)}
          />
        </Switch>
      </Route>
    );
  }
}

export { NS as Namespace };
export default TradeModule;
