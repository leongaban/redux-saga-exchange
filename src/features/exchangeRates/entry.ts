import { makeFeatureEntry } from 'shared/helpers/makeFeatureEntry';
import getSaga from './redux/sagas/index';
import * as actions from './redux/actions/index';
import reducer from './redux/reducers/index';
import * as selectors from './redux/data/selectors';
import * as widgets from './view/widgets';
import * as containers from './view/containers';

const entry = makeFeatureEntry({
  containers,
  actions,
  selectors,
  widgets,
  redux: {
    reducers: { exchangeRates: reducer },
    sagas: [getSaga],
  },
});

type Entry = typeof entry;
export { Entry, entry };
