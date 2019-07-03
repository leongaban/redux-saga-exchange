import * as React from 'react';

import * as features from 'features';
import { featureConnect } from 'core';
import { Preloader } from 'shared/view/elements';

import AccountLayout from '../AccountLayout/AccountLayout';

interface IOwnProps {
  apiKeysFeature: features.apiKeys.Entry;
}

type IProps = IOwnProps;

class SecurityLayout extends React.PureComponent<IProps> {

  public render() {
    const { apiKeysFeature } = this.props;
    const { containers: { ApiKeys } } = apiKeysFeature;

    return (
      <AccountLayout>
        <ApiKeys />
      </AccountLayout>
    );
  }
}

export default (
  featureConnect({
    apiKeysFeature: features.apiKeys.loadEntry,
  }, <Preloader isShow />)(
    SecurityLayout
  ));
