import { withLayout } from '../../shared/WithLayout/WithLayout';
import { routes } from '../constants';
import ForexLayout from './containers/ForexLayout/ForexLayout';

export const layouts = {
  [routes.forex.getPath()]: withLayout({
    desktop: {
      Content: ForexLayout,
    },
    mobile: {
      kind: 'single',
      Content: ForexLayout,
    },
  })
};
