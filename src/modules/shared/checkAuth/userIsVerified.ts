import { customConnectedReduxRedirect, connectedReduxRedirectBaseConfig } from 'shared/helpers/checkAuth';
import { IAppReduxState } from 'shared/types/app';
import { selectors as userServiceSelectors } from 'services/user';

const userIsVerified = customConnectedReduxRedirect<IAppReduxState>({
  ...connectedReduxRedirectBaseConfig,
  authenticatedSelector: state => userServiceSelectors.selectIsVerified(state),
  redirectPath: '/trading',
});

export default userIsVerified;
