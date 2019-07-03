import { routes as tradeRoutes } from './Trade/constants';
import { routes as accountRoutes } from './Account/constants';
import { routes as balanceRoutes } from './Balance/constants';
import { routes as authRoutes } from './Auth/constants';
import { routes as reportsRoutes } from './Reports/constants';
import { routes as adminRoutes } from './Admin/constants';
import { routes as liquidityPoolRoutes } from './LiquidityPool/constants';
import { routes as forexRoutes } from './Forex/constants';

export default {
  ...tradeRoutes,
  ...accountRoutes,
  ...balanceRoutes,
  ...authRoutes,
  ...reportsRoutes,
  ...adminRoutes,
  ...liquidityPoolRoutes,
  ...forexRoutes
};
