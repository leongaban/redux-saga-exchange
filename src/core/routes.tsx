import * as React from 'react';
import { Route, RouteComponentProps, Redirect, Switch } from 'react-router-dom';

import { ROUTES_PREFIX } from 'core/constants';
import { Module } from 'shared/types/app';
import { App } from 'modules/App';
import routes from 'modules/routes';

function getRoutes(modules: Module[]): React.ReactElement<RouteComponentProps<any>> {
  return (
    <Route path={ROUTES_PREFIX}>
      <App>
        <Switch>
          {modules.map(module => module.getRoutes ? module.getRoutes() : null)}
          <Redirect exact from={ROUTES_PREFIX} to={routes.auth.login.getPath()} />
        </Switch>
      </App>
    </Route>
  );
}

export default getRoutes;
