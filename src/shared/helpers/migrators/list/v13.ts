import * as V12 from 'shared/types/models/widgets/versioned/v12';
import * as V13 from 'shared/types/models/widgets/versioned/v13';
import { IMigrator } from 'shared/types/app';

export default function migrate(config: V12.IUserConfig): V13.IUserConfig {

  return {
    ...config,
    presets: config.presets.map(x => ({
      ...x,
      settings: { ...x.settings, 'announcement-bar': {} },
    })),
    version: 13,
  };
}

export const v13Migrator: IMigrator<13> = { migrate, version: 13 };
