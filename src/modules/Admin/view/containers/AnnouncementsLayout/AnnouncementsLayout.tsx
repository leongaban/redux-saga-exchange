import React from 'react';
import * as features from 'features';
import { featureConnect } from 'core';

import AdminLayout from '../AdminLayout/AdminLayout';

interface IFeatureProps {
  announcementFeatureEntry: features.announcementAdmin.Entry;
}

type IProps = IFeatureProps;

class AnnouncementsLayout extends React.PureComponent<IProps> {

  public render() {
    const { announcementFeatureEntry } = this.props;
    return (
      <AdminLayout>
        <announcementFeatureEntry.containers.Announcements />
      </AdminLayout>
    );
  }
}

export default featureConnect({
  announcementFeatureEntry: features.announcementAdmin.loadEntry,
})(AnnouncementsLayout);
