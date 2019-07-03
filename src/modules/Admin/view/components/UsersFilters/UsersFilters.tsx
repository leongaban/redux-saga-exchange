import React from 'react';
import block from 'bem-cn';
import { NavLink } from 'react-router-dom';
import { routes, filters } from '../../../constants';

import './UsersFilters.scss';

const b = block('users-filters');

interface IProps {
  onNavLinkClick(): void;
}

export default class UsersFilters extends React.Component<IProps> {
  public render() {
    const { onNavLinkClick } = this.props;
    return (
      <ul className={b()}>
        <li className={b('nav-link')()} key={routes.admin.users.getElementKey()} >
          <NavLink
            onClick={onNavLinkClick}
            to={routes.admin.users.getPath()}
            activeClassName={b('link', { active: true })()}
            className={b('link')()}
            exact
          >
            All
          </NavLink>
        </li>
        <li className={b('nav-link')()} key={filters[0]} >
          <NavLink
            onClick={onNavLinkClick}
            to={`${routes.admin.users.getPath()}/${filters[0]}`}
            activeClassName={b('link', { active: true })()}
            className={b('link')()}
          >
            Verified users
          </NavLink>
        </li>
        <li className={b('nav-link')()} key={filters[1]} >
          <NavLink
            onClick={onNavLinkClick}
            to={`${routes.admin.users.getPath()}/${filters[1]}`}
            activeClassName={b('link', { active: true })()}
            className={b('link')()}
          >
            Not verified users
          </NavLink>
        </li>
        <li className={b('nav-link')()} key={filters[2]} >
          <NavLink
            onClick={onNavLinkClick}
            to={`${routes.admin.users.getPath()}/${filters[2]}`}
            activeClassName={b('link', { active: true })()}
            className={b('link')()}
          >
            Administrators
          </NavLink>
        </li>
      </ul>
    );
  }
}
