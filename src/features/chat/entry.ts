import { makeFeatureEntry } from 'shared/helpers/makeFeatureEntry';
import { getSaga } from './redux/sagas';
import * as actions from './redux/actions/index';
import reducer from './redux/reducers/index';
import * as selectors from './redux/selectors';
import * as widgets from './view/widgets';

const entry = makeFeatureEntry({
  containers: {},
  actions,
  selectors,
  widgets,
  redux: {
    reducers: { chat: reducer },
    sagas: [getSaga],
  },
});

type Entry = typeof entry;
export { Entry, entry };
