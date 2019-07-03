import { withLayout } from '../../shared/WithLayout/WithLayout';
import { routes } from '../constants';
import { OpenOrdersLayout, OrderHistoryLayout, MOrderHistoryLayout, MOpenOrdersLayout } from './containers';

export const layouts = {
  [routes.reports['open-orders'].getPath()]: withLayout({
    desktop: { Content: OpenOrdersLayout },
    mobile: null,
  }),

  [routes.reports['order-history'].getPath()]: withLayout({
    desktop: { Content: OrderHistoryLayout },
    mobile: null,
  }),

  [routes.reports.getPath()]: withLayout({
    desktop: null,
    mobile: {
      kind: 'switchable',
      tabs: [
        {
          key: 'open-orders',
          title: 'Open orders',
          Content: MOpenOrdersLayout,
        },
        {
          key: 'order-history',
          title: 'Order history',
          Content: MOrderHistoryLayout,
        },
      ],
    },
  }),
};
