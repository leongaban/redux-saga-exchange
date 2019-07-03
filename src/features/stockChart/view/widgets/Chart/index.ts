import { IWidget } from 'shared/types/models';
import { default as Content } from './Content/Content';
import { default as HeaderLeftPart } from './HeaderLeftPart/HeaderLeftPart';
import { default as StockChartSettingsForm } from './Settings/Settings';
import { stockChartSettingsFormEntry } from '../../../redux/reduxFormEntries';

import { IStockChartSettings, IStockChartFormSettings } from 'shared/types/models/widgets';

const widget: IWidget<IStockChartSettings, IStockChartFormSettings> = {
  Content,
  headerLeftPart: { kind: 'with-settings', Content: HeaderLeftPart },
  removable: true,
  titleI18nKey: 'WIDGETS:CHART-WIDGET-NAME',
  settingsForm: {
    Component: StockChartSettingsForm,
    name: stockChartSettingsFormEntry.name,
  },
};

export default widget;
