import * as V10 from 'shared/types/models/widgets/versioned/v10';
import * as V9 from 'shared/types/models/widgets/versioned/v9';
import { IMigrator } from 'shared/types/app';

function migrate(config: V9.IUserConfig): V10.IUserConfig {

  return {
    ...config,
    hideSmallBalances: false,
    version: 10,
  };
}

export const v10Migrator: IMigrator<10> = { migrate, version: 10 };
