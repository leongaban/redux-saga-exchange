import * as V5 from 'shared/types/models/widgets/versioned/v5';
import * as V6 from 'shared/types/models/widgets/versioned/v6';
import { IMigrator } from 'shared/types/app';

function migrate(config: V5.IUserConfig): V6.IUserConfig {

  return {
    ...config,
    presets: config.presets.map(x => ({
      ...x,
      settings: { ...x.settings, reporting: {} },
    })),
    version: 6,
  };
}

export const v6Migrator: IMigrator<6> = { migrate, version: 6 };
