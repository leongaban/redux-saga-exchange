import * as React from 'react';
import { bind } from 'decko';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import * as authFeature from 'features/auth';
import { IAppReduxState } from 'shared/types/app';
import { routes as tradeRoutes } from 'modules/Trade';
import { IWithLayoutComponentProps } from 'modules/shared/WithLayout/WithLayout';

import { featureConnect } from 'core';
import { NavSegments } from '../../components';
import { routes } from '../../../constants';

interface IOwnProps {
  authFeatureEntry: authFeature.Entry;
}

interface IStateProps {
  isTwoFactorRequired: boolean;
}

function mapState(state: IAppReduxState, featureProps: IOwnProps): IStateProps {
  const { authFeatureEntry } = featureProps;
  const isRequired = authFeatureEntry.selectors.selectTwoFactor(state).isRequired;
  return {
    isTwoFactorRequired: isRequired,
  };
}

type Props = IOwnProps & IStateProps & RouteComponentProps<void> & IWithLayoutComponentProps;

class LoginFormLayout extends React.PureComponent<Props> {
  public render() {
    const { TwoFactorForm, AuthLayout, MAuthLayout, LoginForm } = this.props.authFeatureEntry.containers;
    const { isTwoFactorRequired, clientDeviceType } = this.props;
    if (isTwoFactorRequired) {
      return (
        <TwoFactorForm />
      );
    } else {
      // TODO refactor such layouts, move all clientDeviceType concerns to withLayout
      const Container = clientDeviceType === 'mobile' ? MAuthLayout : AuthLayout;
      return (
        <Container
          navSegmentsComponent={(
            <NavSegments
              onLogin={this.redirectToLogin}
              onRegister={this.redirectToRegister}
              activeKey="login"
            />
          )}
        >
          <LoginForm
            isAdminPanel={false}
            passwordRecoveryPath={routes.auth['reset-password'].getPath()}
            onSuccessfulLogin={this.redirectToTradePage}
          />
        </Container>
      );
    }
  }

  @bind
  private redirectToLogin() {
    this.redirectTo(routes.auth.login.getPath());
  }

  @bind
  private redirectToRegister() {
    this.redirectTo(routes.auth.register.getPath());
  }

  @bind
  private redirectToTradePage() {
    this.redirectTo(tradeRoutes.trade.classic.getPath());
  }

  @bind
  private redirectTo(path: string) {
    this.props.history.push(path);
  }
}

export default (
  featureConnect({
    authFeatureEntry: authFeature.loadEntry,
  })(
    connect(mapState)(
      LoginFormLayout
    )));
