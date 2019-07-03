import block from 'bem-cn';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { bind } from 'decko';
import { Icon } from 'shared/view/elements';
import { routesData, routes } from '../../../constants';

import './Sidebar.scss';
import { IRoutable } from 'shared/types/app';

const b = block('admin-sidebar');

const sideBarRoutes = [
  routes.admin.users,
  routes.admin.markets,
  routes.admin.assets,
  routes.admin.announcements,
  routes.admin.settings,
  routes.admin.support,
  routes.admin.static,
  routes.admin.articles,
  routes.admin.accounts,
  routes.admin.system,
  routes.admin.trading,
  routes.admin.social,
];

export default class Sidebar extends React.Component {
  public render() {
    return (
      <ul className={b()}>
        <Icon
          className={b('logo')()}
          src={require(`./images/logo-inline.svg`)}
        />
        {sideBarRoutes.map(this.renderLink)}
      </ul>
    );
  }

  @bind
  private renderLink(route: IRoutable) {

    const { title, disabled } = routesData[route.getElementKey()];

    return (
      <li className={b('nav-link')()} key={route.getElementKey()} >
        <NavLink
          to={disabled ? '#' : route.getPath()}
          activeClassName={b('link', { active: true })()}
          className={b('link', { disabled })()}
        >
          <Icon
            className={b('route-mark-icon')()}
            src={require(`./images/${route.getElementKey()}-inline.svg`)}
          />
          {title}
        </NavLink>
      </li>
    );
  }

}
