import { customConnectedReduxRedirect, connectedReduxRedirectBaseConfig } from 'shared/helpers/checkAuth';
import { IAppReduxState } from 'shared/types/app';
import { selectors as configSelectors } from 'services/config';
import { routes as authRoutes } from 'modules/Auth';

const userAcceptedTOS = customConnectedReduxRedirect<IAppReduxState>({
  ...connectedReduxRedirectBaseConfig,
  authenticatedSelector: state => {
    return configSelectors.selectAreTOSAccepted(state);
  },
  redirectPath: authRoutes.auth.tos.getPath(),
});

export default userAcceptedTOS;
