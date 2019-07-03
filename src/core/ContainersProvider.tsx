import * as React from 'react';
import { bind } from 'decko';

import { injectable } from 'inversify';
import { inject, TYPES } from './configureIoc';

import { IFeatureEntry, Omit } from 'shared/types/app';

import * as authFeature from 'features/auth';
import * as twoFAProviderFeature from 'features/twoFAProvider';
import * as operationHistoryFeature from 'features/operationHistory';
import * as profileFeature from 'features/profile';
import * as ordersFeature from 'features/orders';
import * as apiKeysFeature from 'features/apiKeys';
import * as transactionsFeature from 'features/transactions';

interface IContainerTypes {
  TwoFactorForm: twoFAProviderFeature.Entry['containers']['TwoFactorForm'];
  SessionExpiration: authFeature.Entry['containers']['SessionExpiration'];
  MOperationHistory: operationHistoryFeature.Entry['containers']['MOperationHistory'];
  PersonalDataForm: profileFeature.Entry['containers']['PersonalDataForm'];
  OrderList: ordersFeature.Entry['containers']['OrderList'];
  OrderHistory: ordersFeature.Entry['containers']['OrderHistory'];
  OpenOrdersTable: ordersFeature.Entry['containers']['OpenOrdersTable'];
  ApiKeys: apiKeysFeature.Entry['containers']['ApiKeys'];
  OperationHistory: operationHistoryFeature.Entry['containers']['OperationHistory'];
  TransactionsTable: transactionsFeature.Entry['containers']['TransactionsTable'];
}

type Container = keyof IContainerTypes;

interface IEntryWithContainer<K extends string, T> {
  containers: { [D in K]: T };
}

type Loader<T extends Container> = () => Promise<IEntryWithContainer<T, IContainerTypes[T]>>;

type LoadersMap = {
  [P in Container]: Loader<P>;
};

type GenericLoadersMap = {
  [P in Container]: Loader<Container>;
};

const containerLoadersDictionary: LoadersMap = {
  TwoFactorForm: twoFAProviderFeature.loadEntry,
  SessionExpiration: authFeature.loadEntry,
  MOperationHistory: operationHistoryFeature.loadEntry,
  PersonalDataForm: profileFeature.loadEntry,
  OrderList: ordersFeature.loadEntry,
  OrderHistory: ordersFeature.loadEntry,
  OpenOrdersTable: ordersFeature.loadEntry,
  ApiKeys: apiKeysFeature.loadEntry,
  OperationHistory: operationHistoryFeature.loadEntry,
  TransactionsTable: transactionsFeature.loadEntry,
};

interface IState {
  containers: {
    [key: string]: React.ComponentType<any>;
  };
}

function containersProvider<L extends Container>(containers: L[], preloader?: React.ReactChild):
  // tslint:disable-next-line:max-line-length
  <Props extends { [K in L]: IContainerTypes[K] }>(WrappedComponent: React.ComponentType<Props>) => React.ComponentClass<Omit<Props, L>> {

  return <Props extends { [K in L]: IContainerTypes[K] }>(
    WrappedComponent: React.ComponentType<Props>,
  ): React.ComponentClass<Omit<Props, L>> => {

    @injectable()
    class ContainersProvider extends React.PureComponent<Omit<Props, L>, IState> {
      public state: IState = { containers: {} };

      @inject(TYPES.connectEntryToStore)
      private connectFeatureToStore: (entry: IFeatureEntry<any, any, any, any, any>) => void;

      public componentWillMount() {
        this.load();
      }

      public componentWillUnmount() {
        this.saveContainerToState = null;
      }

      public render() {
        return typeof preloader !== 'undefined' && !this.areAllContainersLoaded()
          ? preloader
          : <WrappedComponent {...this.state.containers} {...this.props} />;
      }

      @bind
      private async load(): Promise<void> {
        await Promise.all(containers.map(key => this.loadFeatureContainer(key)));
      }

      @bind
      private async loadFeatureContainer(containerKey: Container): Promise<void> {
        const bundle = await (containerLoadersDictionary as GenericLoadersMap)[containerKey]();
        const container = bundle.containers[containerKey];

        this.connectFeatureToStore(bundle);
        if (!container) {
          throw new Error(`ContainersProvider did not find the container "${containerKey}"`);
        }

        this.saveContainerToState && this.saveContainerToState(container, containerKey);
      }

      private saveContainerToState: null | ((container: React.ComponentType<any>, key: string) => void) =
        (cont, key) => {
          this.setState(state => ({
            ...state,
            containers: {
              ...state.containers,
              [key]: cont,
            },
          }));
        }

      @bind
      private areAllContainersLoaded(): boolean {
        return containers.every(key => Boolean(this.state.containers[key]));
      }
    }

    return ContainersProvider;
  };
}

export { IContainerTypes, containersProvider };
