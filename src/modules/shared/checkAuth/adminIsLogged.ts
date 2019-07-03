import { customConnectedReduxRedirect, connectedReduxRedirectBaseConfig } from 'shared/helpers/checkAuth';
import { IAppReduxState } from 'shared/types/app';
import { selectors as userServiceSelectors } from 'services/user';
import { routes as adminRoutes } from 'modules/Admin';

const adminIsLogged = customConnectedReduxRedirect<IAppReduxState>({
  ...connectedReduxRedirectBaseConfig,
  authenticatedSelector: state => userServiceSelectors.selectIsAdminAuthorized(state),
  redirectPath: adminRoutes.admin.login.getPath(),
});

export default adminIsLogged;
