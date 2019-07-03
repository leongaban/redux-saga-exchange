import { ConnectedReduxRedirectConfig, connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect';
import * as R from 'ramda';

// tslint:disable:max-line-length
export interface ICustomReduxRedirectConfig<ReduxState = {}, OwnProps = {}> extends ConnectedReduxRedirectConfig<OwnProps, ReduxState> {
  withSingleCheck: boolean;
}

export function customConnectedReduxRedirect<ReduxState = {}, OwnProps = {}>(
  { withSingleCheck, authenticatedSelector, ...restConfig }: ICustomReduxRedirectConfig<ReduxState, OwnProps>,
) {
  const customAuthSelector = withSingleCheck ? R.once(authenticatedSelector) : authenticatedSelector;
  return connectedReduxRedirect<OwnProps, ReduxState>({
    ...restConfig as ConnectedReduxRedirectConfig,
    authenticatedSelector: customAuthSelector,
  });
}
