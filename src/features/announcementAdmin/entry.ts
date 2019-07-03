import { makeFeatureEntry } from 'shared/helpers/makeFeatureEntry';

import * as containers from './view/containers';
import { actions, reducers, getSaga, selectors } from './redux';

const entry = makeFeatureEntry({
  containers,
  actions,
  selectors,
  widgets: {},
  redux: {
    reducers: { announcementsAdmin: reducers },
    sagas: [ getSaga ],
  },
});

type Entry = typeof entry;

export { Entry, entry };
