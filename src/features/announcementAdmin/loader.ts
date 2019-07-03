import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "announcementAdmin" */ './entry').then(feature => feature.entry);
}
