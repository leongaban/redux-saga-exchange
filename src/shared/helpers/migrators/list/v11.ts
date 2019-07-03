import * as V11 from 'shared/types/models/widgets/versioned/v11';
import * as V10 from 'shared/types/models/widgets/versioned/v10';
import { IMigrator } from 'shared/types/app';

function migrate(config: V10.IUserConfig): V11.IUserConfig {

  return {
    ...config,
    shouldOpenMarketOrderWarningModal: true,
    version: 11,
  };
}

export const v11Migrator: IMigrator<11> = { migrate, version: 11 };
