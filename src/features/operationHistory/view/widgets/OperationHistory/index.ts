import { IWidget, IOperationHistorySettings } from 'shared/types/models';

import { default as Content } from './Content/Content';

const widget: IWidget<IOperationHistorySettings, null> = {
  Content,
  headerLeftPart: { kind: 'with-title' },
  removable: true,
  titleI18nKey: 'WIDGETS:OPERATION-HISTORY-WIDGET-NAME',
};

export default widget;
