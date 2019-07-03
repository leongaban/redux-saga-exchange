import { customConnectedReduxRedirect, connectedReduxRedirectBaseConfig } from 'shared/helpers/checkAuth';
import { IAppReduxState } from 'shared/types/app';
import { selectors as userServiceSelectors } from 'services/user';
import { routes as tradeRoutes } from 'modules/Trade';

const userIsNotLogged = customConnectedReduxRedirect<IAppReduxState>({
  ...connectedReduxRedirectBaseConfig,
  authenticatedSelector: state => !userServiceSelectors.selectIsAuthorized(state),
  redirectPath: tradeRoutes.trade.classic.getPath(),
});

export default userIsNotLogged;
