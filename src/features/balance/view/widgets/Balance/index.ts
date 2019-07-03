import { IWidget, IBalanceSettings, IBalanceFormSettings } from 'shared/types/models';

import { balanceSettingsFormEntry } from '../../../redux/reduxFormEntries';
import Settings from './Settings/Settings';

import { default as Content } from './Content/Content';

const widget: IWidget<IBalanceSettings, IBalanceFormSettings> = {
  Content,
  headerLeftPart: { kind: 'with-title' },
  settingsForm: { Component: Settings, name: balanceSettingsFormEntry.name },
  removable: true,
  titleI18nKey: 'WIDGETS:BALANCE-WIDGET-NAME',
};

export default widget;
