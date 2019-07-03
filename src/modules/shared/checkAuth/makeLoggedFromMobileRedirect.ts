import { compose } from 'redux';

import { customConnectedReduxRedirect, connectedReduxRedirectBaseConfig } from 'shared/helpers/checkAuth';
import { IAppReduxState } from 'shared/types/app';
import { selectors as configServiceSelectors } from 'services/config';
import { userIsLogged } from '.';

function makeLoggedFromMobileRedirect(redirectPath: string) {
  return compose(
    customConnectedReduxRedirect<IAppReduxState>({
      ...connectedReduxRedirectBaseConfig,
      authenticatedSelector: state => configServiceSelectors.selectClientDeviceType(state) === 'mobile',
      redirectPath,
    }),
    userIsLogged
  );
}

export default makeLoggedFromMobileRedirect;
