import React from 'react';
import { featureConnect } from 'core';
import { RouteComponentProps } from 'react-router';
import * as marketsFeature from 'features/markets';
import AdminLayout from '../AdminLayout/AdminLayout';

interface IFeatureProps {
  marketsFeatureEntry: marketsFeature.Entry;
}

type Props = IFeatureProps & RouteComponentProps<void>;

class MarketsLayout extends React.PureComponent<Props> {
  public render() {
    const { Markets } = this.props.marketsFeatureEntry.containers;
    return (
      <AdminLayout>
        <Markets />
      </AdminLayout>
    );
  }
}

const withFeatures = featureConnect({
  marketsFeatureEntry: marketsFeature.loadEntry,
})(MarketsLayout);

export default withFeatures;
