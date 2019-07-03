import { customConnectedReduxRedirect, connectedReduxRedirectBaseConfig } from 'shared/helpers/checkAuth';
import { IAppReduxState } from 'shared/types/app';
import { selectors as userServiceSelectors } from 'services/user';
import { routes as authRoutes } from 'modules/Auth';

const userIsLogged = customConnectedReduxRedirect<IAppReduxState>({
  ...connectedReduxRedirectBaseConfig,
  authenticatedSelector: state => userServiceSelectors.selectIsAuthorized(state),
  redirectPath: authRoutes.auth.login.getPath(),
});

export default userIsLogged;
