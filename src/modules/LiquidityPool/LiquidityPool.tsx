import * as React from 'react';
import { compose } from 'redux';
import { Route } from 'react-router-dom';

import { Module } from 'shared/types/app';
import {
  userIsLogged,
  userAcceptedTOS,
  userConfirmedSecurityNotice,
  userIsVerified
} from 'modules/shared/checkAuth';

import { routes } from './constants';
import { layouts } from './view/layouts';

const userIsCleared = compose(userIsLogged, userAcceptedTOS, userConfirmedSecurityNotice, userIsVerified);

class LiquidityPoolModule extends Module {
  public getRoutes() {
    return (
      <Route
        key={routes['liquidity-pool'].getElementKey()}
        path={routes['liquidity-pool'].getPath()}
        component={userIsCleared(layouts[routes['liquidity-pool'].getPath()] as any)}
      />
    );
  }
}

export default LiquidityPoolModule;
