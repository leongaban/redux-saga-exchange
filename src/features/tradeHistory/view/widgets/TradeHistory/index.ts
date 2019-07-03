import { IWidget, ITradeHistorySettings } from 'shared/types/models';

import { default as Content } from './Content/Content';

const widget: IWidget<ITradeHistorySettings, null> = {
  Content,
  headerLeftPart: { kind: 'with-title' },
  removable: true,
  titleI18nKey: 'WIDGETS:TRADE-HISTORY-WIDGET-NAME',
};

export default widget;
