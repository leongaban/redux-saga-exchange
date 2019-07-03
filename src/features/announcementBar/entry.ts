import { makeFeatureEntry } from 'shared/helpers/makeFeatureEntry';

import * as containers from './view/containers';
import * as widgets from './view/widgets';
import { actions, reducer, selectors } from './redux';
import { getSaga } from './redux/sagas/index';

const entry = makeFeatureEntry({
  containers,
  actions,
  selectors,
  widgets,
  redux: {
    reducers: { announcements: reducer },
    sagas: [getSaga],
  },
});

type Entry = typeof entry;

export { Entry, entry };
