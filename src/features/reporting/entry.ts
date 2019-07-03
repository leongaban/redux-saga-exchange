import { makeFeatureEntry } from 'shared/helpers/makeFeatureEntry';

import * as widgets from './view/widgets';

const entry = makeFeatureEntry({
  containers: {},
  actions: {},
  selectors: {},
  widgets,
  redux: {},
});

type Entry = typeof entry;

export { Entry, entry };
