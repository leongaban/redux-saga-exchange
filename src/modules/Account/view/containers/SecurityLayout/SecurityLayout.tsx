import * as React from 'react';

import * as features from 'features';
import { featureConnect } from 'core';
import { Preloader } from 'shared/view/elements';
import { LinedSection } from 'shared/view/components';

import AccountLayout from '../AccountLayout/AccountLayout';

interface IOwnProps {
  twoFAProviderFeature: features.twoFAProvider.Entry;
}

type IProps = IOwnProps;

class SecurityLayout extends React.PureComponent<IProps> {

  public render() {
    const { twoFAProviderFeature } = this.props;
    const { containers: { TwoFactorForm } } = twoFAProviderFeature;

    return (
      <AccountLayout>
        <LinedSection>
          <TwoFactorForm />
        </LinedSection>
      </AccountLayout>
    );
  }
}

export default (
  featureConnect({
    twoFAProviderFeature: features.twoFAProvider.loadEntry,
  }, <Preloader isShow />)(
    SecurityLayout
  ));
