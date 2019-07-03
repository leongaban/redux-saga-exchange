import { IUserConfig } from 'shared/types/models';

import { preset } from './preset';

export { settingsDefaults, preset } from './preset';

export const defaultUserConfig: IUserConfig = {
  version: 13,
  activePresetName: preset.name,
  presets: [{ ...preset }],
  areTOSAccepted: false,
  isSecurityNoticeConfirmed: false,
  hideSmallBalances: false,
  savedWithdrawalAddresses: {},
  shouldOpenMarketOrderWarningModal: true,
  reportsSettings: {
    openOrders: {
      shouldOpenCancelOrderModal: true,
    },
  },
};
