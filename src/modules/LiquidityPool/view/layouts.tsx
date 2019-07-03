import { withLayout } from '../../shared/WithLayout/WithLayout';
import { routes } from '../constants';
import LiquidityPoolLayout from './containers/LiquidityPoolLayout/LiquidityPoolLayout';

export const layouts = {
  [routes['liquidity-pool'].getPath()]: withLayout({
    desktop: {
      Content: LiquidityPoolLayout,
    },
    mobile: {
      kind: 'single',
      Content: LiquidityPoolLayout,
    },
  })
};
