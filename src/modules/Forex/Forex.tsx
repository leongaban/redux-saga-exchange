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

class ForexModule extends Module {
  public getRoutes() {
    return (
      <Route
        key={routes.forex.getElementKey()}
        path={routes.forex.getPath()}
        component={userIsCleared(layouts[routes.forex.getPath()] as any)}
      />
    );
  }
}

export default ForexModule;
