import { buildRouteTree } from 'shared/helpers/buildRouteTree';
import { UsersFilter } from 'shared/types/requests';

export const routes = buildRouteTree({
  admin: {
    login: null,
    logout: null,
    users: null,
    support: null,
    settings: null,
    static: null,
    articles: null,
    markets: null,
    accounts: null,
    system: null,
    trading: null,
    social: null,
    assets: null,
    announcements: null,
  },
});

interface IRouteData {
  title: string;
  disabled: boolean;
}

export const routesData: { [route: string]: IRouteData } = {
  [routes.admin.users.getElementKey()]: { title: 'Users', disabled: false },
  [routes.admin.support.getElementKey()]: { title: 'Support requests', disabled: true },
  [routes.admin.settings.getElementKey()]: { title: 'Settings', disabled: true },
  [routes.admin.static.getElementKey()]: { title: 'Static pages', disabled: true },
  [routes.admin.articles.getElementKey()]: { title: 'Manage articles', disabled: true },
  [routes.admin.markets.getElementKey()]: { title: 'Markets', disabled: false },
  [routes.admin.accounts.getElementKey()]: { title: 'Accounts', disabled: true },
  [routes.admin.system.getElementKey()]: { title: 'System statistics', disabled: true },
  [routes.admin.trading.getElementKey()]: { title: 'Trading statistics', disabled: true },
  [routes.admin.social.getElementKey()]: { title: 'Social statistics', disabled: true },
  [routes.admin.assets.getElementKey()]: { title: 'Assets', disabled: false },
  [routes.admin.announcements.getElementKey()]: { title: 'Manage announcements', disabled: false },
};

export const filters: UsersFilter[] = [
  'verified',
  'unverified',
  'admins',
];
