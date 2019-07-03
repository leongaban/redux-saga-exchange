import { Entry } from './entry';

export function loadEntry(): Promise<Entry> {
  return import(/* webpackChunkName: "profile" */ './entry').then(feature => feature.entry);
}
