import * as React from 'react';
import * as authFeature from 'features/auth';
import { featureConnect } from 'core';
import qs from 'query-string';

import { RouteComponentProps } from 'react-router';
import { bind } from 'decko';
import { routes } from 'modules/Auth';
import { AuthPage } from '../../components';

interface IOwnProps {
  authFeature: authFeature.Entry;
}

type Props = IOwnProps & RouteComponentProps<void>;

class ConfirmEmailLayout extends React.PureComponent<Props> {
  public render() {
    const { ConfirmEmail } = this.props.authFeature.containers;
    const parsed = qs.parse(this.props.location.search);
    return (
      <AuthPage>
        <ConfirmEmail
          confirmEmailInfo={{
            email: parsed.email,
            token: parsed.code,
          }}
          onSuccessfulConfirm={this.redirectToTradePage}
        />
      </AuthPage>
    );
  }

  @bind
  private redirectToTradePage() {
    this.redirectTo(routes.auth.login.getPath());
  }

  @bind
  private redirectTo(path: string) {
    this.props.history.push(path);
  }
}

const withFeatures = featureConnect({
  authFeature: authFeature.loadEntry,
})(ConfirmEmailLayout);

export default withFeatures;
