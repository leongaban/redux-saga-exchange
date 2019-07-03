import { ICustomReduxRedirectConfig } from './customConnectedReduxRedirect';
import { routerActions } from 'react-router-redux';

const connectedReduxRedirectBaseConfig: Pick<
  ICustomReduxRedirectConfig, 'redirectAction' | 'allowRedirectBack' | 'withSingleCheck'
> = {
  redirectAction: routerActions.replace,
  allowRedirectBack: false,
  withSingleCheck: false,
};

export default connectedReduxRedirectBaseConfig;
