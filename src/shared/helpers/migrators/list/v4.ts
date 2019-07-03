import * as V3 from 'shared/types/models/widgets/versioned/v3';
import * as V4 from 'shared/types/models/widgets/versioned/v4';
import { IMigrator } from 'shared/types/app';
import { defaultPresetV4 } from 'shared/constants';

function migrate(config: V3.IUserConfig): V4.IUserConfig {
  return {
    ...config,
    presets: [{ ...defaultPresetV4 }],
    version: 4,
  };
}

export const v4Migrator: IMigrator<4> = { migrate, version: 4 };
