import { IWidget, IOrderBookSettings, IOrderBookFormSettings } from 'shared/types/models';

import { default as Content } from './Content/Content';
import { default as HeaderLeftPart } from './HeaderLeftPart/HeaderLeftPart';
import { default as Settings } from './Settings/Settings';
import { orderBookSettingsFormEntry } from '../../../redux/reduxFormEntries';

const widget: IWidget<IOrderBookSettings, IOrderBookFormSettings> = {
  Content,
  headerLeftPart: { kind: 'with-settings', Content: HeaderLeftPart },
  removable: true,
  titleI18nKey: 'WIDGETS:ORDER-BOOK-WIDGET-NAME',
  settingsForm: {
    Component: Settings,
    name: orderBookSettingsFormEntry.name,
  }
};

export default widget;
