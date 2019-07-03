import { getContainer } from 'core';
import * as features from 'features';

import { withLayout } from '../../shared/WithLayout/WithLayout';
import { MProfileTab } from '../namespace';
import { routes } from '../constants';

import { ApiKeysLayout, ProfileLayout, SecurityLayout } from './containers';

const mobileTabs = [
  {
    route: routes.account.profile,
    title: 'Profile',
    Content: getContainer(features.profile.loadEntry)('PersonalDataForm') as any,
  },
  {
    route: routes.account.security,
    title: 'Security',
    Content: getContainer(features.twoFAProvider.loadEntry)('TwoFactorForm') as any,
  },
  {
    route: routes.account['api-keys'],
    title: 'API Keys',
    Content: getContainer(features.apiKeys.loadEntry)('ApiKeys') as any,
  }
];

export const layouts = {
  [routes.account.profile.getPath()]: withLayout<MProfileTab>({
    desktop: { Content: ProfileLayout },
    mobile: {
      kind: 'switchable-with-individual-routes',
      tabs: mobileTabs,
    },
  }),
  [routes.account.security.getPath()]: withLayout<MProfileTab>({
    desktop: { Content: SecurityLayout },
    mobile: {
      kind: 'switchable-with-individual-routes',
      tabs: mobileTabs,
    },
  }),
  [routes.account['api-keys'].getPath()]: withLayout<MProfileTab>({
    desktop: { Content: ApiKeysLayout },
    mobile: {
      kind: 'switchable-with-individual-routes',
      tabs: mobileTabs,
    },
  }),
};
