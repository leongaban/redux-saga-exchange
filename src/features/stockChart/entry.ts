import { makeFeatureEntry } from 'shared/helpers/makeFeatureEntry';
import * as actions from './redux/actions';
import * as selectors from './redux/selectors';
import reducer from './redux/reducers';
import getSaga from './redux/saga';
import * as widgets from './view/widgets';
import * as containers from './view/containers';

const entry = makeFeatureEntry({
  containers,
  actions,
  selectors,
  widgets,
  redux: {
    reducers: {stockChartWidget: reducer},
    sagas: [getSaga],
  },
});

type Entry = typeof entry;
export { Entry, entry };
