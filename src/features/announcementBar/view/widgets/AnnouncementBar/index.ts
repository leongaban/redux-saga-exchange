import { IWidget, IAnnouncementBarSettings, IAnnouncementBarFormSettings} from 'shared/types/models';

import { default as Content } from './Content/Content';

const widget: IWidget<IAnnouncementBarSettings, IAnnouncementBarFormSettings> = {
  Content,
  headerLeftPart: { kind: 'with-title' },
  removable: true,
  titleI18nKey: 'WIDGETS:ANNOUNCEMENTBAR-NAME',
};

export default widget;
