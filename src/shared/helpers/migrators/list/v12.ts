import * as V12 from 'shared/types/models/widgets/versioned/v12';
import * as V11 from 'shared/types/models/widgets/versioned/v11';
import { IMigrator } from 'shared/types/app';

function migrate(config: V11.IUserConfig): V12.IUserConfig {

  return {
    ...config,
    isSecurityNoticeConfirmed: false,
    version: 12,
  };
}

export const v12Migrator: IMigrator<12> = { migrate, version: 12 };
