import * as React from 'react';

import featureConnect from 'core/FeatureConnector';
import { orders } from 'features';
import { ISwitchableMobileContentProps } from 'shared/types/ui';

import { ReportContainer } from '../../../components';
import { MReportsTab } from '../../../../namespace';

interface IFeatureProps {
  ordersFeatureEntry: orders.Entry;
}

type IProps = IFeatureProps & ISwitchableMobileContentProps<MReportsTab>;

class MOrderHistoryLayout extends React.PureComponent<IProps> {
  public render() {
    const { ordersFeatureEntry } = this.props;
    return (
      <ReportContainer title="Order history">
        <ordersFeatureEntry.containers.MOrderHistory />
      </ReportContainer>
    );
  }
}

export default featureConnect({
  ordersFeatureEntry: orders.loadEntry,
})(MOrderHistoryLayout);
