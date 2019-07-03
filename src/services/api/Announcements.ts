import { bind } from 'decko';

import { IAnnouncement } from 'shared/types/models';
import BaseApi from './Base';
import { IGetAnnouncementsResponse, IPostAnnouncementsResponse } from './types/responses';

class AnnouncementsApi extends BaseApi {

  @bind
  public async loadFrontOfficeAnnouncements(type: number): Promise<IAnnouncement[]> {
    const response = await this.actions.get<IGetAnnouncementsResponse>(`/frontoffice/announcements/${type}`);
    const responseData = response.data.data;

    return responseData.content && responseData.content.length ?
      responseData.content.map(item => ({content: item})) : [];
  }

  @bind
  public async loadAnnouncements(type: number): Promise<IAnnouncement[]> {
    const response = await this.actions.get<IGetAnnouncementsResponse>(`/back-api/backoffice/announcements/${type}`);
    const responseData = response.data.data;
    return responseData.content && responseData.content.length ?
      responseData.content.map(item => ({content: item})) : [];
  }

  @bind
  public async saveAnnouncements(items: IAnnouncement[], type: number): Promise<IPostAnnouncementsResponse> {

    const response = await this.actions.get<IGetAnnouncementsResponse>(`/back-api/backoffice/announcements/${type}`);
    if (response.data && response.data.data) {
      await this.actions.put<IPostAnnouncementsResponse>(`/back-api/backoffice/announcements/${type}`,
        items.map(item => item.content), {}, {});
    } else {
      await this.actions.post<IPostAnnouncementsResponse>(`/back-api/backoffice/announcements`, {
        type,
        content: items.map(item => item.content)
      });
    }

    return { saved: true };
  }
}

export default AnnouncementsApi;
