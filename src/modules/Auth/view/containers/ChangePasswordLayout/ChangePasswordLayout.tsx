import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import qs from 'query-string';
import { bind } from 'decko';

import * as authFeature from 'features/auth';
import { featureConnect } from 'core';

import { routes } from '../../../constants';
import { AuthPage } from '../../components';

interface IOwnProps {
  authFeature: authFeature.Entry;
}

type Props = IOwnProps & RouteComponentProps<void>;

class ChangePasswordLayout extends React.PureComponent<Props> {
  public render() {
    const { ChangePasswordForm } = this.props.authFeature.containers;
    const parsed = qs.parse(this.props.location.search);
    return (
      <AuthPage>
        <ChangePasswordForm
          resetPasswordToken={parsed.code}
          email={parsed.email}
          onSuccessfullPasswordChange={this.redirectToLogin}
        />
      </AuthPage>
    );
  }

  @bind
  private redirectToLogin() {
    this.redirectTo(routes.auth.login.getPath());
  }

  @bind
  private redirectTo(path: string) {
    this.props.history.push(path);
  }
}

const withFeatures = featureConnect({
  authFeature: authFeature.loadEntry,
})(ChangePasswordLayout);

export default withFeatures;
