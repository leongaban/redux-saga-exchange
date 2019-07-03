import { compose } from 'redux';

import { customConnectedReduxRedirect, connectedReduxRedirectBaseConfig } from 'shared/helpers/checkAuth';
import { IAppReduxState } from 'shared/types/app';
import { selectors as configServiceSelectors } from 'services/config';
import { userIsLogged } from '.';

function makeLoggedFromDesktopRedirect(redirectPath: string) {
  return compose(
    customConnectedReduxRedirect<IAppReduxState>({
      ...connectedReduxRedirectBaseConfig,
      authenticatedSelector: state => configServiceSelectors.selectClientDeviceType(state) === 'desktop',
      redirectPath,
    }),
    userIsLogged
  );
}

export default makeLoggedFromDesktopRedirect;
