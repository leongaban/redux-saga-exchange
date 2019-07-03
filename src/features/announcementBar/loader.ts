import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "announcementBar" */ './entry').then(feature => feature.entry);
}
