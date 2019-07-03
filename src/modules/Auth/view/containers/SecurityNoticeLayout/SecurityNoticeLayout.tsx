import * as React from 'react';
import { bind } from 'decko';
import { RouteComponentProps } from 'react-router';

import { featureConnect } from 'core';
import * as authFeature from 'features/auth';
import { routes as tradeRoutes } from 'modules/Trade';

interface IFeatureProps {
  authFeatureEntry: authFeature.Entry;
}

type IProps = IFeatureProps & RouteComponentProps<void>;

class SecurityNoticeLayout extends React.PureComponent<IProps> {
  public render() {
    const { authFeatureEntry } = this.props;
    return (
      <authFeatureEntry.containers.TwoFactorNotice
        onAccept={this.handleAccept}
      />
    );
  }

  @bind
  private handleAccept() {
    this.props.history.push(tradeRoutes.trade.classic.getPath());
  }
}

export default featureConnect({
  authFeatureEntry: authFeature.loadEntry,
})(SecurityNoticeLayout);
