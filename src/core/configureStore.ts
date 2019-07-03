import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { reducer as formReducer } from 'redux-form';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { History } from 'history';
import createHistory from 'history/createBrowserHistory';
import { compose, applyMiddleware, combineReducers, createStore, Reducer, Middleware, Store } from 'redux';
import { reducer as multiConnectReducer } from 'shared/helpers/redux/multiConnect';
import { composeReducers, createErrorReporterMiddleware } from 'shared/helpers/redux';

import { IAppReduxState, IDependencies } from 'shared/types/app';
import { ReducersMap } from 'shared/types/redux';
import resetAppStateReducer from 'shared/helpers/redux/resetAppState/resetAppStateReducer';

interface IStoreData {
  store: Store<IAppReduxState>;
  runSaga: SagaMiddleware<any>['run'];
  history: History;
}

function configureStore(deps: IDependencies): IStoreData {
  const history: History = createHistory();
  const reactRouterReduxMiddleware = routerMiddleware(history);
  const sagaMiddleware = createSagaMiddleware();
  const middlewares: Middleware[] = [
    reactRouterReduxMiddleware,
    sagaMiddleware,
    thunk.withExtraArgument(deps),
    createErrorReporterMiddleware(),
  ];

  const composeEnhancers = process.env.NODE_ENV === 'development' ? composeWithDevTools({
    actionsBlacklist: [
      'CHART:WS_UPDATE',
      'SET_CURRENT_CANDLE',
      'USER_ACTIVITY_MONITORING:SET_LAST_ACITIVITY_COMPLETED',
    ],
  }) : compose;

  const store: Store<IAppReduxState> = createStore(
    (state: IAppReduxState) => state,
    composeEnhancers(applyMiddleware(...middlewares)),
  );

  return {
    store,
    runSaga: sagaMiddleware.run,
    history,
  };
}

function createReducer(reducers: ReducersMap<IAppReduxState>): Reducer<IAppReduxState | undefined> {
  return composeReducers<IAppReduxState | undefined>([
    multiConnectReducer as Reducer<IAppReduxState>,
    combineReducers<IAppReduxState>({
      ...reducers,
      form: formReducer,
      Router: routerReducer,
    }),
    resetAppStateReducer,
  ]);
}

export { createReducer, IStoreData };
export default configureStore;
