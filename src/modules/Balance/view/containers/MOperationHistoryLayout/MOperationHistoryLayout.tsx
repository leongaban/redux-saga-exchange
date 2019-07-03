import * as React from 'react';

import * as features from 'features';
import { featureConnect } from 'core';
import { ISwitchableMobileContentProps } from 'shared/types/ui';

import { MBalanceTab } from '../../../namespace';

interface IOwnProps {
  operationHistoryEntry: features.operationHistory.Entry;
}

type IProps = IOwnProps & ISwitchableMobileContentProps<MBalanceTab>;

class MOperationHistoryLayout extends React.PureComponent<IProps> {
  public render() {
    const { operationHistoryEntry: { containers: { Header, MOperationHistory }} } = this.props;

    return (
      <>
        <Header/>
        <MOperationHistory/>
      </>
    );
  }
}

export default (
  featureConnect({
    operationHistoryEntry: features.operationHistory.loadEntry,
  })(MOperationHistoryLayout));
