import { buildRouteTree } from 'shared/helpers/buildRouteTree';

export const routes = buildRouteTree({
  account: {
    'profile': null,
    'security': null,
    'api-keys': null,
  },
});
