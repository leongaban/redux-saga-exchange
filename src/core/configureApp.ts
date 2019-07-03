import { Reducer } from 'redux';

import configureDeps from './configureDeps';
import { TYPES, container } from './configureIoc';
import configureStore, { createReducer } from './configureStore';

import * as moduleClasses from 'modules';
import * as apiErrorInterceptors from 'modules/Auth/apiErrorInterceptors';
import * as userService from 'services/user';
import * as chartService from 'services/chart';
import * as chatService from 'services/chat';
import * as i18nService from 'services/i18n';
import * as protectorService from 'services/protector';
import * as socketService from 'services/sockets';
import * as configService from 'services/config';
import * as orderBookService from 'services/orderBookDataSource';
import * as minitickerService from 'services/miniTickerDataSource';
import * as openOrdersService from 'services/openOrdersDataSource';
import * as notificationService from 'services/notification';
import * as userActivityMonitoringFeature from 'features/userActivityMonitoring';

import { ReducersMap } from 'shared/types/redux';
import { IAppData, Module, RootSaga, IAppReduxState, IReduxEntry } from 'shared/types/app';

function configureApp(data?: IAppData): IAppData {
  /* Prepare main app elements */
  const modules: Module[] = Object.values(moduleClasses).map(ModuleClass => new ModuleClass());

  if (data) {
    return { ...data, modules };
  }

  const sharedReduxEntries: IReduxEntry[] = [
    userService.reduxEntry,
    chartService.reduxEntry,
    chatService.reduxEntry,
    i18nService.reduxEntry,
    socketService.reduxEntry,
    protectorService.reduxEntry,
    configService.reduxEntry,
    userActivityMonitoringFeature.reduxEntry,
    notificationService.reduxEntry,
    orderBookService.reduxEntry,
    minitickerService.reduxEntry,
    openOrdersService.reduxEntry,
  ];

  const connectedSagas: RootSaga[] = [];
  const connectedReducers: ReducersMap<Partial<IAppReduxState>> = {};
  const dependencies = configureDeps();
  const { runSaga, store, history } = configureStore(dependencies);
  container.bind(TYPES.connectEntryToStore).toConstantValue(connectEntryToStore);

  sharedReduxEntries.forEach(connectEntryToStore);
  modules.forEach((module: Module) => {
    if (module.getReduxEntry) {
      connectEntryToStore(module.getReduxEntry());
    }
  });

  function connectEntryToStore({ reducers, sagas }: IReduxEntry) {
    if (!store) {
      throw new Error('Cannot find store, while connecting module.');
    }

    if (reducers) {
      const keys = Object.keys(reducers) as Array<keyof typeof reducers>;
      const isNeedReplace: boolean = keys.reduce<boolean>((acc, key: keyof typeof reducers) => {
        const featureReducer = reducers[key];
        if (!connectedReducers[key] && featureReducer) {
          connectedReducers[key] = featureReducer;
          return true;
        }
        return acc || false;
      }, false);

      if (isNeedReplace) {
        store.replaceReducer(
          createReducer(
            connectedReducers as ReducersMap<IAppReduxState>
          ) as Reducer<IAppReduxState>
        );
      }
    }

    if (sagas) {
      sagas.forEach((saga: RootSaga) => {
        if (!connectedSagas.includes(saga) && runSaga) {
          runSaga(saga(dependencies));
          connectedSagas.push(saga);
        }
      });
    }
  }

  // set up i18n
  i18nService.i18nInstance.store = store;
  const userLanguage: i18nService.namespace.Lang = 'en';
  store.dispatch(i18nService.actions.changeLanguage(userLanguage));

  dependencies.api.initializeDispatch(store.dispatch);
  // set up interceptors
  dependencies.api.addErrorInterceptor(apiErrorInterceptors.handleSessionExpired(store.dispatch));

  return { modules, store, history };
}

export default configureApp;
