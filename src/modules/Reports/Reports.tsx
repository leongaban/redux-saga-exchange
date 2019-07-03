import * as React from 'react';
import { compose } from 'redux';
import { Route } from 'react-router-dom';

import { Module } from 'shared/types/app';
import {
  userIsLogged,
  userAcceptedTOS,
  makeLoggedFromDesktopRedirect,
  makeLoggedFromMobileRedirect,
  userConfirmedSecurityNotice,
} from 'modules/shared/checkAuth';

import { routes } from './constants';
import { layouts } from './view/layouts';

const deviceTypeIsMobile = makeLoggedFromMobileRedirect(routes.reports['open-orders'].getPath());
const deviceTypeIsDesktop = makeLoggedFromDesktopRedirect(routes.reports.mobile.getPath());
const userIsCleared = compose(userIsLogged, userAcceptedTOS, userConfirmedSecurityNotice);
const userIsLoggedFromMobileAndAcceptedTOS = compose(deviceTypeIsMobile, userIsCleared);
const userIsLoggedFromDesktopAndAcceptedTOS = compose(deviceTypeIsDesktop, userIsCleared);

class TradeModule extends Module {
  public getRoutes() {
    return (
      <Route
        key="reports"
        path={routes.reports.getPath()}
        render={this.renderReportsRoutes}
      />
    );
  }

  private renderReportsRoutes() {
    return (
      <React.Fragment>
        <Route
          path={routes.reports['open-orders'].getPath()}
          component={userIsLoggedFromDesktopAndAcceptedTOS(layouts[routes.reports['open-orders'].getPath()] as any)}
        />
        <Route
          path={routes.reports['order-history'].getPath()}
          component={userIsLoggedFromDesktopAndAcceptedTOS(layouts[routes.reports['order-history'].getPath()] as any)}
        />
        <Route
          path={routes.reports.mobile.getPath()}
          component={userIsLoggedFromMobileAndAcceptedTOS(layouts[routes.reports.getPath()] as any)}
        />
        {/* <Route
            path={routes.reports['trade-history'].getPath()}
            component={userIsLoggedAndAcceptedTOS(TradeHistoryLayout as any)}
            /> */}
      </React.Fragment>
    );
  }
}

export default TradeModule;
