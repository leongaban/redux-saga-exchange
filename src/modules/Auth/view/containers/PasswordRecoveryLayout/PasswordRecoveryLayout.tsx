import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import * as authFeature from 'features/auth';
import { featureConnect } from 'core';
import { IWithLayoutComponentProps } from 'modules/shared/WithLayout/WithLayout';

interface IOwnProps {
  authFeature: authFeature.Entry;
}

type Props = IOwnProps & RouteComponentProps<void> & IWithLayoutComponentProps;

class PasswordRecoveryLayout extends React.PureComponent<Props> {
  public render() {
    const {
      authFeature: { containers: { AuthLayout, MAuthLayout, PasswordRecoveryForm } }, clientDeviceType,
    } = this.props;
    const Container = clientDeviceType === 'mobile' ? MAuthLayout : AuthLayout;
    return (
      <Container title="FORGOT PASSWORD">
        <PasswordRecoveryForm />
      </Container>
    );
  }
}

export default (
  featureConnect({
    authFeature: authFeature.loadEntry,
  })(
    PasswordRecoveryLayout
  ));
