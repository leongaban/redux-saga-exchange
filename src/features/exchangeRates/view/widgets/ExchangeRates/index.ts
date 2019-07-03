import { IWidget, IExchangeRatesSettings, IExchangeRatesFormSettings } from 'shared/types/models';

import Header from './HeaderLeftPart/HeaderLeftPart';
import Content from './Content/Content';
import Settings from './Settings/Settings';
import { reduxFormEntries } from '../../../redux';

const widget: IWidget<IExchangeRatesSettings, IExchangeRatesFormSettings> = {
  Content,
  headerLeftPart: { kind: 'with-settings', Content: Header },
  removable: false,
  titleI18nKey: 'WIDGETS:EXCHANGE-RATES-WIDGET-NAME',
  settingsForm: { Component: Settings, name: reduxFormEntries.exchangeRatesSettingsFormEntry.name }
};

export default widget;
