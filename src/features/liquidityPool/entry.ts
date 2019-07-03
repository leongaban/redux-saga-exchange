import { makeFeatureEntry } from 'shared/helpers/makeFeatureEntry';

import * as containers from './view/containers';
import { actions, selectors, reducer, getSaga } from './redux';

const entry = makeFeatureEntry({
  containers,
  actions,
  selectors,
  redux: {
    reducers: { liquidityPool: reducer },
    sagas: [getSaga],
  },
  widgets: {},
});

type Entry = typeof entry;

export { Entry, entry };
