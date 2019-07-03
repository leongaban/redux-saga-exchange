import { withLayout } from '../../shared/WithLayout/WithLayout';
import { routes } from '../constants';
import { MBalanceTab } from '../namespace';
import { BalanceLayout, MBalanceLayout, MOperationHistoryLayout } from './containers';

export const layouts = {
  [routes.balance.getPath()]: withLayout<MBalanceTab>({
    desktop: { Content: BalanceLayout },
    mobile: {
      kind: 'switchable', tabs: [
        {
          key: 'balance',
          title: 'Balance',
          Content: MBalanceLayout,
        },
        {
          key: 'operation-history',
          title: 'Operation History',
          Content: MOperationHistoryLayout,
        },

      ]
    },
  }),
};
