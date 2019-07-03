import * as React from 'react';

import { Preloader } from 'shared/view/elements';

import featureConnect from './FeatureConnector';

interface IContainersHolder<T> {
  containers: T;
}

export function getContainer<T>(entryLoader: () => Promise<IContainersHolder<T>>) {
  return (containerKey: keyof T) => {

    interface IProps {
      entry: any;
    }

    class ContainerRenderer extends React.PureComponent<IProps> {
      public render() {
        const { entry } = this.props;
        const Container = entry.containers[containerKey];
        return <Container />;
      }
    }

    return featureConnect({ entry: entryLoader }, <Preloader isShow />)(ContainerRenderer);
  };
}
