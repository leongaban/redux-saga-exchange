import { customConnectedReduxRedirect, connectedReduxRedirectBaseConfig } from 'shared/helpers/checkAuth';
import { IAppReduxState } from 'shared/types/app';
import { selectors as userServiceSelectors } from 'services/user';
import { routes as tradeRoutes } from 'modules/Trade';

const userIsAdminOrSupport = customConnectedReduxRedirect<IAppReduxState>({
  ...connectedReduxRedirectBaseConfig,
  authenticatedSelector: state => {
    const userRoles = userServiceSelectors.selectUserRoles(state);
    return userRoles ? userRoles.includes('Admin') || userRoles.includes('Support') : false;
  },
  redirectPath: tradeRoutes.trade.classic.getPath(),
});

export default userIsAdminOrSupport;
