import { customConnectedReduxRedirect, connectedReduxRedirectBaseConfig } from 'shared/helpers/checkAuth';
import { IAppReduxState } from 'shared/types/app';
import { selectors as configSelectors } from 'services/config';
import { routes as authRoutes } from 'modules/Auth';

const userConfirmedSecurityNotice = customConnectedReduxRedirect<IAppReduxState>({
  ...connectedReduxRedirectBaseConfig,
  authenticatedSelector: state => {
    return configSelectors.selectIsSecurityNoticeConfirmed(state);
  },
  redirectPath: authRoutes.auth['security-notice'].getPath(),
});

export default userConfirmedSecurityNotice;
