import { customConnectedReduxRedirect, connectedReduxRedirectBaseConfig } from 'shared/helpers/checkAuth';
import { IAppReduxState } from 'shared/types/app';
import { selectors as userServiceSelectors } from 'services/user';
import { routes as adminRoutes } from 'modules/Admin';

const adminIsNotLogged = customConnectedReduxRedirect<IAppReduxState>({
  ...connectedReduxRedirectBaseConfig,
  authenticatedSelector: state => !userServiceSelectors.selectIsAdminAuthorized(state),
  redirectPath: adminRoutes.admin.users.getPath(),
});

export default adminIsNotLogged;
