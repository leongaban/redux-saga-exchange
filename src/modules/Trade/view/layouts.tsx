import * as React from 'react';

import { getContainer } from 'core/getContainer';
import * as features from 'features';

import { withLayout } from '../../shared/WithLayout/WithLayout';
import { routes } from '../constants';
import { MTradeClassicTab } from '../namespace';
import { ClassicTradeWidgetOptions, TradePage, MCharts, MTradePage } from './containers';

export const layouts = {
  [routes.trade.classic.getPath()]: withLayout<MTradeClassicTab>({
    desktop: {
      additionalRightPanelItem: <ClassicTradeWidgetOptions />,
      Content: TradePage,
    },
    mobile: {
      kind: 'switchable',
      tabs: [
        {
          key: 'charts',
          title: 'Charts',
          Content: MCharts
        },

        {
          key: 'trade',
          title: 'Trade',
          Content: MTradePage
        },

        {
          key: 'open-orders',
          title: 'Open Orders',
          Content: getContainer(features.orders.loadEntry)('MOrderList') as any
        },
      ]
    },
  })
};
