import { IWidget, IOrderHistorySettings, IOrderHistoryFormSettings } from 'shared/types/models';

import { orderHistorySettingsFormEntry } from '../../../redux/data/reduxFormEntries';
// tslint:disable-next-line:max-line-length
import ordersTableHeaderLeftPartFactory from '../../factories/OrdersTableHeaderLeftPartFactory/OrdersTableHeaderLeftPartFactory';
import Settings from '../../containers/OrderHistorySettings/OrderHistorySettings';
import Content from './Content/Content';

const widget: IWidget<IOrderHistorySettings, IOrderHistoryFormSettings> = {
  Content,
  headerLeftPart: {
    kind: 'with-settings',
    Content: ordersTableHeaderLeftPartFactory('WIDGETS:ORDER-HISTORY-WIDGET-NAME'),
  },
  settingsForm: {
    Component: Settings,
    name: orderHistorySettingsFormEntry.name,
  },
  removable: true,
  titleI18nKey: 'WIDGETS:ORDER-HISTORY-WIDGET-NAME',
};

export default widget;
