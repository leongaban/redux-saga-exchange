import { IWidget, IOrderListSettings, IOrderListFormSettings } from 'shared/types/models';

import { orderListSettingsFormEntry } from '../../../redux/data/reduxFormEntries';
// tslint:disable-next-line:max-line-length
import ordersTableHeaderLeftPartFactory from '../../factories/OrdersTableHeaderLeftPartFactory/OrdersTableHeaderLeftPartFactory';
import Settings from './Settings/Settings';
import Content from './Content/Content';

const widget: IWidget<IOrderListSettings, IOrderListFormSettings> = {
  Content,
  headerLeftPart: {
    kind: 'with-settings',
    Content: ordersTableHeaderLeftPartFactory('WIDGETS:ORDER-LIST-WIDGET-NAME'),
  },
  settingsForm: {
    Component: Settings,
    name: orderListSettingsFormEntry.name,
  },
  removable: true,
  titleI18nKey: 'WIDGETS:ORDER-LIST-WIDGET-NAME',
};

export default widget;
