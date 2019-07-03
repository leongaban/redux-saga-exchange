import { IAppReduxState } from 'shared/types/app';
import { IAnnouncement } from 'shared/types/models';

export function selectAnnouncements(state: IAppReduxState): IAnnouncement[] {
  return state.announcements.data.items;
}

export function selectAnnouncementsLoading(state: IAppReduxState): boolean {
  return state.announcements.communication.loadingAnnouncements.isRequesting;
}
