import React from 'react';
import { bind } from 'decko';
import block from 'bem-cn';
import { withRouter, RouteComponentProps } from 'react-router';

import * as features from 'features';
import { featureConnect } from 'core';

import { routes } from '../../../constants';
import './LoginLayout.scss';

interface IFeatureProps {
  authFeatureEntry: features.auth.Entry;
}

type IProps = IFeatureProps & RouteComponentProps<void>;

const b = block('admin-login-layout');

class LoginLayout extends React.PureComponent<IProps> {

  public render() {
    const { authFeatureEntry } = this.props;
    return (
      <div className={b()}>
        <authFeatureEntry.containers.LoginForm
          isAdminPanel
          onSuccessfulLogin={this.redirectToAdminUsersPage}
        />
      </div>
    );
  }

  @bind
  private redirectToAdminUsersPage() {
    this.redirectTo(routes.admin.users.getPath());
  }

  @bind
  private redirectTo(path: string) {
    this.props.history.push(path);
  }
}

export default withRouter(featureConnect({
  authFeatureEntry: features.auth.loadEntry,
})(LoginLayout));
