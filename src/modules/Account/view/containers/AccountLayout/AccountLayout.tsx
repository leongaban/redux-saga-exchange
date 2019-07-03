import * as React from 'react';
import block from 'bem-cn';
import { withRouter, RouteComponentProps } from 'react-router';

import { Tabs } from 'shared/view/elements';
import { ITranslateProps, i18nConnect } from 'services/i18n';
import { ITab } from 'shared/types/ui';
import { IRoutable } from 'shared/types/app';

import { routes } from '../../../constants';
import './AccountLayout.scss';

type IProps = ITranslateProps & RouteComponentProps<void>;

const b = block('account-layout');

class AccountLayout extends React.PureComponent<IProps> {
  private tabRoutes: IRoutable[] = [routes.account.profile, routes.account.security, routes.account['api-keys']];

  private get tabs(): ITab[] {
    return this.tabRoutes.map(route => ({
      key: route.getElementKey(),
      active: this.checkIsRouteActive(route),
      onClick: () => this.redirectTo(route),
      title: this.props.translate(`ACCOUNT:${route.getElementKey().toUpperCase()}-TAB-TITLE`),
    }));
  }

  public render() {

    return (
      <div className={b()}>
        <div className={b('wrapper')()}>
          <div className={b('header')()}>
            <Tabs tabs={this.tabs} />
          </div>
          <div className={b('content')()}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }

  private checkIsRouteActive(route: IRoutable) {
    return route.getPath() === this.props.location.pathname;
  }

  private redirectTo(route: IRoutable) {
    this.props.history.push(route.getPath());
  }
}

export default (
  withRouter(
    i18nConnect(
      AccountLayout,
    )
  )
);

export { AccountLayout };
