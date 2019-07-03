import * as React from 'react';
import { bind } from 'decko';
import { RouteComponentProps, withRouter } from 'react-router';

import { featureConnect } from 'core';
import * as features from 'features';
import { routes } from '../../../constants';

interface IFeatureProps {
  authFeatureEntry: features.auth.Entry;
}

type IProps = IFeatureProps & RouteComponentProps<{}>;

class LogoutLayout extends React.PureComponent<IProps> {

  public render() {
    const { authFeatureEntry: { containers: { Logout } } } = this.props;
    return <Logout isAdminPanel onSuccessfullLogout={this.redirectToLogin} />;
  }

  @bind
  private redirectToLogin() {
    this.props.history.push(routes.admin.login.getPath());
  }
}

export default (
  withRouter(
    featureConnect({ authFeatureEntry: features.auth.loadEntry })(
      LogoutLayout,
    ),
  )
);
