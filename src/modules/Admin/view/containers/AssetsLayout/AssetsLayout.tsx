import React from 'react';
import * as features from 'features';
import { featureConnect } from 'core';
import block from 'bem-cn';

import AdminLayout from '../AdminLayout/AdminLayout';
import './AssetsLayout.scss';

interface IFeatureProps {
  assetsFeatureEntry: features.assets.Entry;
}

type IProps = IFeatureProps;

const b = block('assets-layout');

class AssetsLayout extends React.PureComponent<IProps> {

  public render() {
    const { assetsFeatureEntry } = this.props;
    return (
      <AdminLayout>
        <div className={b()}>
          <assetsFeatureEntry.containers.AssetsInfoTable />
          <assetsFeatureEntry.containers.EditAsset />
        </div>
      </AdminLayout>
    );
  }
}

export default featureConnect({
  assetsFeatureEntry: features.assets.loadEntry,
})(AssetsLayout);
