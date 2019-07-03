import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "chat" */ './entry').then(feature => feature.entry);
}
