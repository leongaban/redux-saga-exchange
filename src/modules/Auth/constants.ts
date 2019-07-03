import { buildRouteTree } from 'shared/helpers/buildRouteTree';

export const routes = buildRouteTree({
  auth: {
    'login': null,
    'register': null,
    'reset-password': null,
    'logout': null,
    'confirm-email': null,
    'restore-password': null,
    'tos': null,
    'security-notice': null,
    'thank-you': null,
  },
});
