import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "apiKeys" */ './entry').then(feature => feature.entry);
}
