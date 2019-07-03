import * as React from 'react';

import featureConnect from 'core/FeatureConnector';
import { orders } from 'features';
import { ISwitchableMobileContentProps } from 'shared/types/ui';

import { MReportsTab } from '../../../../namespace';
import { ReportContainer } from '../../../components';

interface IFeatureProps {
  ordersFeatureEntry: orders.Entry;
}

type IProps = IFeatureProps & ISwitchableMobileContentProps<MReportsTab>;

class MOpenOrdersLayout extends React.PureComponent<IProps> {
  public render() {
    const { ordersFeatureEntry } = this.props;
    return (
      <ReportContainer title="Open orders">
        <ordersFeatureEntry.containers.MOrderList />
      </ReportContainer>
    );
  }
}

export default featureConnect({
  ordersFeatureEntry: orders.loadEntry,
})(MOpenOrdersLayout);
