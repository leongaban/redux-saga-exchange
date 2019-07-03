import { IWidget, IReportingFormSettings, IReportingSettings } from 'shared/types/models';

import HeaderLeftPartContent from './HeaderLeftPart/HeaderLeftPart';
import Content from './Content/Content';
import Settings from './Settings/Settings';

export const Reporting: IWidget<IReportingSettings, IReportingFormSettings> = {
  Content,
  headerLeftPart: { kind: 'with-settings', Content: HeaderLeftPartContent },
  removable: true,
  titleI18nKey: 'WIDGETS:REPORTING-WIDGET-NAME',
  settingsForm: { name: 'reportingSettingsForm', Component: Settings }
};
