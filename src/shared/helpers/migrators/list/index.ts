import { IMigrator } from 'shared/types/app';

import { v1Migrator } from './v1';
import { v2Migrator } from './v2';
import { v3Migrator } from './v3';
import { v4Migrator } from './v4';
import { v5Migrator } from './v5';
import { v6Migrator } from './v6';
import { v7Migrator } from './v7';
import { v8Migrator } from './v8';
import { v9Migrator } from './v9';
import { v10Migrator } from './v10';
import { v11Migrator } from './v11';
import { v12Migrator } from './v12';
import { v13Migrator } from './v13';

// should be sorted by ascending version
const migrators: Array<IMigrator<number>> = [
  v1Migrator,
  v2Migrator,
  v3Migrator,
  v4Migrator,
  v5Migrator,
  v6Migrator,
  v7Migrator,
  v8Migrator,
  v9Migrator,
  v10Migrator,
  v11Migrator,
  v12Migrator,
  v13Migrator
];

export default migrators;
