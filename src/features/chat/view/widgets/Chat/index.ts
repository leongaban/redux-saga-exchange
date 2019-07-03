import { IWidget } from 'shared/types/models';

import { default as Content } from './Content/Content';
// NOTE: Uncomment to re-enable search
// import { default as HeaderLeftPart } from './HeaderLeftPart/HeaderLeftPart';

const widget: IWidget<null, null> = {
  Content,
  // NOTE: Uncomment (and remove line 11) to re-enable search
  // headerLeftPart: { kind: 'with-custom-content', Content: HeaderLeftPart },
  headerLeftPart: { kind: 'with-title' },
  removable: true,
  titleI18nKey: 'WIDGETS:CHAT-WIDGET-NAME',
  disabled: false,
};

export default widget;
