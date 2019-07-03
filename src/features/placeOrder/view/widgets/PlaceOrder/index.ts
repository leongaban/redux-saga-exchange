import { IWidget, IPlaceOrderSettings, IPlaceOrderFormSettings } from 'shared/types/models';

import { reduxFormEntries } from '../../../redux';
import Content from './Content/Content';
import Settings from './Settings/Settings';

const widget: IWidget<IPlaceOrderSettings, IPlaceOrderFormSettings> = {
  Content,
  headerLeftPart: { kind: 'with-title' },
  removable: true,
  titleI18nKey: 'WIDGETS:PLACE-ORDER-WIDGET-NAME',
  settingsForm: { Component: Settings, name: reduxFormEntries.placeOrderSettingsFormEntry.name },
};

export default widget;
