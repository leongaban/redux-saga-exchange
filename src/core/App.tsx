import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import { IAppData } from 'shared/types/app';

import createRoutes from './routes';

function App({ modules, store, history }: IAppData) {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>{createRoutes(modules)}</ConnectedRouter>
    </Provider>
  );
}

export default App;
