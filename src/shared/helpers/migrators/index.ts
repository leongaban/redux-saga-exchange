import * as R from 'ramda';

import { IHoldingVersion, IMigrator } from 'shared/types/app';

import migrators from './list';

export function migrateToLatest(config: Partial<IHoldingVersion<number>>) {
  const { version } = config;
  const requiredMigrators = version
    ? R.dropWhile(x => x.version <= version, migrators)
    : migrators;

  return requiredMigrators.reduce(
    (acc: any, x: IMigrator<number>) => x.migrate(acc),
    config,
  );
}
