import * as React from 'react';
import * as authFeature from 'features/auth';
import { featureConnect } from 'core';
import { bind } from 'decko';
import { RouteComponentProps } from 'react-router';

import { IWithLayoutComponentProps } from 'modules/shared/WithLayout/WithLayout';

import { NavSegments } from '../../components';
import { routes } from '../../../constants';

interface IOwnProps {
  authFeature: authFeature.Entry;
}

type Props = IOwnProps & RouteComponentProps<void> & IWithLayoutComponentProps;

class RegistrationFormLayout extends React.PureComponent<Props> {
  public render() {
    const { clientDeviceType } = this.props;
    const { AuthLayout, MAuthLayout, RegistrationForm } = this.props.authFeature.containers;
    const Container = clientDeviceType === 'mobile' ? MAuthLayout : AuthLayout;
    return (
      <Container
        navSegmentsComponent={(
          <NavSegments
            onLogin={this.redirectToLogin}
            onRegister={this.redirectToRegister}
            activeKey="register"
          />
        )}
      >
        <RegistrationForm
          redirectToPasswordRecovery={this.redirectToPasswordRecovery}
          onRegisterSuccess={this.redirectToThankYou}
        />
      </Container>
    );
  }

  @bind
  private redirectToLogin() {
    this.props.history.push(routes.auth.login.getPath());
  }

  @bind
  private redirectToRegister() {
    this.props.history.push(routes.auth.register.getPath());
  }

  @bind
  private redirectToThankYou() {
    this.props.history.push(routes.auth['thank-you'].getPath());
  }

  @bind
  private redirectToPasswordRecovery() {
    this.props.history.push(routes.auth['reset-password'].getPath());
  }
}

export default (
  featureConnect({
    authFeature: authFeature.loadEntry,
  })(
    RegistrationFormLayout,
  ));
