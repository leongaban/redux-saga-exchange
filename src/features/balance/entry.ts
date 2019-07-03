import { makeFeatureEntry } from 'shared/helpers/makeFeatureEntry';

import * as containers from './view/containers';
import * as widgets from './view/widgets';
import { actions, selectors, reducer, getSaga } from './redux';

const entry = makeFeatureEntry({
  containers,
  actions,
  selectors,
  widgets,
  redux: {
    reducers: { balance: reducer },
    sagas: [getSaga],
  },
});

type Entry = typeof entry;

export { Entry, entry };
