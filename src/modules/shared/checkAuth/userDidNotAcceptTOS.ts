import { customConnectedReduxRedirect, connectedReduxRedirectBaseConfig } from 'shared/helpers/checkAuth';
import { IAppReduxState } from 'shared/types/app';
import { selectors as configSelectors } from 'services/config';
import { routes as tradeRoutes } from 'modules/Trade';

const userDidNotAcceptTOS = customConnectedReduxRedirect<IAppReduxState>({
  ...connectedReduxRedirectBaseConfig,
  authenticatedSelector: state => {
    return !configSelectors.selectAreTOSAccepted(state);
  },
  redirectPath: tradeRoutes.trade.classic.getPath(),
});

export default userDidNotAcceptTOS;
