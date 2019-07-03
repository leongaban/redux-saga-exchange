import * as React from 'react';
import { IWidgetContentProps } from 'shared/types/models';
import AnnouncementBar from './../../../containers/AnnouncementBar/AnnouncementBar';

class Content extends React.PureComponent<IWidgetContentProps> {
  public render() {
    return <AnnouncementBar />;
  }
}

export default Content;
